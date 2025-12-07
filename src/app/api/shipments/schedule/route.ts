import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { addDays, format, isWeekend, isBefore, startOfDay } from "date-fns";

/**
 * Delivery schedule schema
 */
const DeliveryScheduleSchema = z.object({
  shipmentId: z.string().optional(),
  orderId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  timeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']),
  specialInstructions: z.string().max(500).optional(),
});

/**
 * Time slot configuration
 */
const TIME_SLOTS = {
  MORNING: { label: 'Morning', time: '8:00 AM - 12:00 PM' },
  AFTERNOON: { label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
  EVENING: { label: 'Evening', time: '5:00 PM - 9:00 PM' },
  ANYTIME: { label: 'Anytime', time: 'All day' },
};

/**
 * Philippines holidays (2024-2025)
 */
const PHILIPPINES_HOLIDAYS: Record<string, string> = {
  '2024-12-25': 'Christmas Day',
  '2024-12-30': 'Rizal Day',
  '2024-12-31': "New Year's Eve",
  '2025-01-01': "New Year's Day",
  '2025-01-29': 'Chinese New Year',
  '2025-02-25': 'EDSA Revolution Anniversary',
  '2025-04-09': 'Araw ng Kagitingan',
  '2025-04-17': 'Maundy Thursday',
  '2025-04-18': 'Good Friday',
  '2025-04-19': 'Black Saturday',
  '2025-05-01': 'Labor Day',
  '2025-06-12': 'Independence Day',
  '2025-08-25': 'National Heroes Day',
  '2025-11-01': "All Saints' Day",
  '2025-11-30': 'Bonifacio Day',
  '2025-12-25': 'Christmas Day',
  '2025-12-30': 'Rizal Day',
  '2025-12-31': "New Year's Eve",
};

/**
 * GET /api/shipments/schedule
 * Get available delivery slots for the next 14 days
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') || 'NCR';
    const provider = searchParams.get('provider') || 'JT_EXPRESS';
    const daysAhead = parseInt(searchParams.get('days') || '14');

    // Generate available slots for the next N days
    const slots = [];
    const today = startOfDay(new Date());

    for (let i = 1; i <= daysAhead; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isHoliday = PHILIPPINES_HOLIDAYS[dateStr];
      const isWeekendDay = isWeekend(date);

      // Determine available time slots
      let availableSlots: string[] = [];

      if (!isHoliday) {
        if (isWeekendDay) {
          // Limited slots on weekends
          availableSlots = ['MORNING', 'AFTERNOON'];
        } else {
          // All slots on weekdays
          availableSlots = ['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME'];
        }

        // Express providers have same-day delivery for NCR
        if (i === 1 && region === 'NCR' && ['GRAB', 'LALAMOVE', 'MOVEIT'].includes(provider)) {
          const currentHour = new Date().getHours();
          if (currentHour < 10) {
            availableSlots = ['MORNING', 'AFTERNOON', 'EVENING'];
          } else if (currentHour < 14) {
            availableSlots = ['AFTERNOON', 'EVENING'];
          } else if (currentHour < 17) {
            availableSlots = ['EVENING'];
          } else {
            availableSlots = [];
          }
        }
      }

      slots.push({
        date: dateStr,
        dayOfWeek: format(date, 'EEEE'),
        slots: availableSlots,
        isHoliday: !!isHoliday,
        holidayName: isHoliday || undefined,
        isWeekend: isWeekendDay,
      });
    }

    return NextResponse.json({
      slots,
      timeSlots: TIME_SLOTS,
      region,
      provider,
    });
  } catch (error) {
    console.error("Error getting delivery slots:", error);
    return NextResponse.json(
      { error: "Failed to get delivery slots" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments/schedule
 * Schedule delivery for a shipment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = DeliveryScheduleSchema.parse(body);

    // Validate date is in the future
    const scheduledDate = new Date(validatedData.date);
    if (isBefore(scheduledDate, startOfDay(new Date()))) {
      return NextResponse.json(
        { error: "Cannot schedule delivery in the past" },
        { status: 400 }
      );
    }

    // Check if date is a holiday
    if (PHILIPPINES_HOLIDAYS[validatedData.date]) {
      return NextResponse.json(
        { error: `Cannot schedule delivery on ${PHILIPPINES_HOLIDAYS[validatedData.date]}` },
        { status: 400 }
      );
    }

    // Find shipment or order
    let shipment;
    if (validatedData.shipmentId) {
      shipment = await prisma.shipment.findUnique({
        where: { id: validatedData.shipmentId },
        include: { order: true },
      });
    } else if (validatedData.orderId) {
      shipment = await prisma.shipment.findUnique({
        where: { orderId: validatedData.orderId },
        include: { order: true },
      });
    }

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    // Verify user owns the order or is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && shipment.order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update shipment with scheduled delivery
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        estimatedDelivery: scheduledDate,
        notes: validatedData.specialInstructions
          ? `${shipment.notes || ''}\nDelivery scheduled: ${validatedData.timeSlot} - ${validatedData.specialInstructions}`.trim()
          : `${shipment.notes || ''}\nDelivery scheduled: ${validatedData.timeSlot}`.trim(),
      },
    });

    return NextResponse.json({
      message: "Delivery scheduled successfully",
      shipment: updatedShipment,
      schedule: {
        date: validatedData.date,
        timeSlot: validatedData.timeSlot,
        timeSlotLabel: TIME_SLOTS[validatedData.timeSlot].label,
        timeSlotTime: TIME_SLOTS[validatedData.timeSlot].time,
        specialInstructions: validatedData.specialInstructions,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error scheduling delivery:", error);
    return NextResponse.json(
      { error: "Failed to schedule delivery" },
      { status: 500 }
    );
  }
}

