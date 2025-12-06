'use client';

/**
 * Discount Rules Engine Component
 * Phase 26.2.5: Discount Rules Engine
 * 
 * Create complex discount rules with conditions and actions.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings2, Plus, Trash2, ChevronDown, ChevronUp,
  ShoppingCart, Users, Tag, Calendar, Package
} from 'lucide-react';

// Types for discount rules
export interface DiscountCondition {
  id: string;
  type: 'MIN_ORDER' | 'MIN_QUANTITY' | 'CATEGORY' | 'PRODUCT' | 'USER_SEGMENT' | 'DATE_RANGE';
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'BETWEEN';
  value: string | number | string[];
}

export interface DiscountAction {
  id: string;
  type: 'PERCENTAGE_OFF' | 'FIXED_OFF' | 'FREE_SHIPPING' | 'FREE_ITEM' | 'BOGO';
  value: number;
  maxDiscount?: number;
  targetProducts?: string[];
}

export interface DiscountRule {
  id: string;
  name: string;
  description?: string;
  conditions: DiscountCondition[];
  actions: DiscountAction[];
  priority: number;
  isActive: boolean;
  combinesWith: boolean;
}

interface DiscountRulesEngineProps {
  rules?: DiscountRule[];
  onSaveRule?: (rule: DiscountRule) => void;
  className?: string;
}

export function DiscountRulesEngine({
  rules = [],
  onSaveRule,
  className,
}: DiscountRulesEngineProps) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<DiscountRule | null>(null);

  // Get condition icon
  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'MIN_ORDER': return <ShoppingCart className="h-4 w-4" />;
      case 'MIN_QUANTITY': return <Package className="h-4 w-4" />;
      case 'CATEGORY': return <Tag className="h-4 w-4" />;
      case 'USER_SEGMENT': return <Users className="h-4 w-4" />;
      case 'DATE_RANGE': return <Calendar className="h-4 w-4" />;
      default: return <Settings2 className="h-4 w-4" />;
    }
  };

  // Format condition display
  const formatCondition = (condition: DiscountCondition) => {
    const typeLabels: Record<string, string> = {
      MIN_ORDER: 'Minimum Order',
      MIN_QUANTITY: 'Minimum Quantity',
      CATEGORY: 'Category',
      PRODUCT: 'Product',
      USER_SEGMENT: 'User Segment',
      DATE_RANGE: 'Date Range',
    };

    const operatorLabels: Record<string, string> = {
      EQUALS: '=',
      GREATER_THAN: '>',
      LESS_THAN: '<',
      IN: 'in',
      NOT_IN: 'not in',
      BETWEEN: 'between',
    };

    return `${typeLabels[condition.type]} ${operatorLabels[condition.operator]} ${
      Array.isArray(condition.value) ? condition.value.join(', ') : condition.value
    }`;
  };

  // Format action display
  const formatAction = (action: DiscountAction) => {
    switch (action.type) {
      case 'PERCENTAGE_OFF': return `${action.value}% off`;
      case 'FIXED_OFF': return `₱${action.value} off`;
      case 'FREE_SHIPPING': return 'Free shipping';
      case 'FREE_ITEM': return 'Free item';
      case 'BOGO': return 'Buy one get one';
      default: return action.type;
    }
  };

  // Mock rules for demo
  const displayRules = rules.length > 0 ? rules : [
    {
      id: 'rule-1',
      name: 'Bulk Order Discount',
      description: 'Apply 15% discount for orders over ₱5000',
      conditions: [
        { id: 'c1', type: 'MIN_ORDER' as const, operator: 'GREATER_THAN' as const, value: 5000 },
      ],
      actions: [
        { id: 'a1', type: 'PERCENTAGE_OFF' as const, value: 15, maxDiscount: 1000 },
      ],
      priority: 1,
      isActive: true,
      combinesWith: false,
    },
    {
      id: 'rule-2',
      name: 'VIP Customer Discount',
      description: 'Extra 10% for VIP customers',
      conditions: [
        { id: 'c2', type: 'USER_SEGMENT' as const, operator: 'IN' as const, value: ['VIP', 'PREMIUM'] },
      ],
      actions: [
        { id: 'a2', type: 'PERCENTAGE_OFF' as const, value: 10 },
      ],
      priority: 2,
      isActive: true,
      combinesWith: true,
    },
  ];

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Discount Rules Engine</h3>
        </div>
        <Button size="sm" onClick={() => setEditingRule({
          id: `rule-${Date.now()}`,
          name: '',
          conditions: [],
          actions: [],
          priority: displayRules.length + 1,
          isActive: true,
          combinesWith: false,
        })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="divide-y divide-border">
        {displayRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Settings2 className="mb-2 h-8 w-8" />
            <p>No discount rules configured</p>
          </div>
        ) : (
          displayRules.map((rule) => (
            <div key={rule.id} className="p-4">
              {/* Rule Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                    P{rule.priority}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    {rule.description && (
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule.combinesWith && (
                    <Badge variant="outline" className="text-xs">Stackable</Badge>
                  )}
                  {expandedRule === rule.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRule === rule.id && (
                <div className="mt-4 space-y-4 pl-12">
                  {/* Conditions */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Conditions (IF)</h5>
                    <div className="space-y-2">
                      {rule.conditions.map((condition, idx) => (
                        <div key={condition.id} className="flex items-center gap-2 text-sm">
                          {getConditionIcon(condition.type)}
                          <span>{formatCondition(condition)}</span>
                          {idx < rule.conditions.length - 1 && (
                            <Badge variant="outline" className="text-xs">AND</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Actions (THEN)</h5>
                    <div className="space-y-2">
                      {rule.actions.map((action) => (
                        <div key={action.id} className="flex items-center gap-2 text-sm">
                          <Tag className="h-4 w-4 text-primary" />
                          <span>{formatAction(action)}</span>
                          {action.maxDiscount && (
                            <Badge variant="secondary" className="text-xs">
                              Max: ₱{action.maxDiscount}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

