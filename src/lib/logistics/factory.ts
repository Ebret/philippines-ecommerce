import { BaseLogisticsProvider } from "./base";
import { LBCExpressProvider } from "./lbc";
import { TwoGoExpressProvider } from "./twogo";
import { JRSExpressProvider } from "./jrs";

/**
 * Logistics Provider Factory
 * Creates and manages logistics provider instances
 */
export class LogisticsFactory {
  private static providers: Map<string, BaseLogisticsProvider> = new Map();

  /**
   * Initialize logistics providers with API credentials
   */
  static initialize(): void {
    const lbcApiKey = process.env.LBC_API_KEY || "mock_lbc_key";
    const lbcApiSecret = process.env.LBC_API_SECRET || "mock_lbc_secret";
    const lbcWebhookSecret = process.env.LBC_WEBHOOK_SECRET || "mock_lbc_webhook";

    const twoGoApiKey = process.env.TWOGO_API_KEY || "mock_twogo_key";
    const twoGoApiSecret = process.env.TWOGO_API_SECRET || "mock_twogo_secret";
    const twoGoWebhookSecret = process.env.TWOGO_WEBHOOK_SECRET || "mock_twogo_webhook";

    const jrsApiKey = process.env.JRS_API_KEY || "mock_jrs_key";
    const jrsApiSecret = process.env.JRS_API_SECRET || "mock_jrs_secret";
    const jrsWebhookSecret = process.env.JRS_WEBHOOK_SECRET || "mock_jrs_webhook";

    this.providers.set(
      "LBC",
      new LBCExpressProvider(lbcApiKey, lbcApiSecret, lbcWebhookSecret)
    );

    this.providers.set(
      "TWO_GO",
      new TwoGoExpressProvider(twoGoApiKey, twoGoApiSecret, twoGoWebhookSecret)
    );

    this.providers.set(
      "JRS",
      new JRSExpressProvider(jrsApiKey, jrsApiSecret, jrsWebhookSecret)
    );
  }

  /**
   * Get logistics provider by name
   */
  static getProvider(providerName: string): BaseLogisticsProvider {
    if (this.providers.size === 0) {
      this.initialize();
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Logistics provider not found: ${providerName}`);
    }

    return provider;
  }

  /**
   * Get all available providers
   */
  static getAllProviders(): Map<string, BaseLogisticsProvider> {
    if (this.providers.size === 0) {
      this.initialize();
    }

    return this.providers;
  }

  /**
   * Register custom provider
   */
  static registerProvider(
    name: string,
    provider: BaseLogisticsProvider
  ): void {
    this.providers.set(name, provider);
  }

  /**
   * Check if provider is available
   */
  static hasProvider(providerName: string): boolean {
    if (this.providers.size === 0) {
      this.initialize();
    }

    return this.providers.has(providerName);
  }
}

// Initialize on module load
LogisticsFactory.initialize();

