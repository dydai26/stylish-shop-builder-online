

declare module "https://esm.sh/stripe@14.21.0?target=deno" {
  export default class Stripe {
    constructor(secretKey: string, config?: { apiVersion: string });
    paymentIntents: {
      create(params: any): Promise<any>;
    };
  }
}

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  export const env: Env;
  export function serve(handler: (request: Request) => Promise<Response>): void;
}