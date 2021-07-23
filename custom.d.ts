import * as admin from 'firebase-admin';
import { GeoJsonObject } from 'geojson';

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export interface AppUser {
  email: string;
  isEmployee: boolean;
  firstName?: string;
  lastName?: string;
  stripe?: {
    created: number;
    customerId: string;
    default_payment_method?: string;
  };
  subscriptions?: {
    insights: {
      stripe: {
        status: string;
        current_period_start: number;
        current_period_end: number;
        subscription_id: string;
        plan: {
          amount: number;
          id: string;
          interval: string;
          interval_count: number;
        }
      };
    };
  };
  integrations?: {
    leaf?: {
      user: {
        id: string;
        johnDeereCredentials?: {
          status: string;
        }
      }
      fields?: {
        count: number;
      }
    }
  }
}

export interface GeoJsonFeature {
  id: string;
  data: {
    geometry: any;
    properties: any;
    type: string;
  };
  paint: any;
  created: Date;
  updated: Date;
  owner: Array<string>;
  shared?: Array<string>;
  fieldName: string;
  fieldNotes: string;
  thumbnail: string;
  source: {
    type: string;
    id: string;
    isEdited: boolean;
  };
  centerpoint: {
    lat: number;
    lon: number;
  };
}

export interface FieldSummary {
  id: string;
  name: string;
  acres: number;
  shared?: Array<string>;
}

export interface FieldGroup {
  id: string;
  owner: Array<string>;
  fields: Array<FieldSummary>;
  shared?: Array<string>;
  sharedObject?: Array<FieldGroupSharedSummary>;
  name: string;
  index: number;
}

export interface FieldGroupSharedSummary {
  fullGroupAccess: boolean;
  uid: string;
}

export interface Credentials {
  id: string;
  apiOwnerUsername: string;
  status: string;
  clientKey: string;
  clientSecret: string;
  tokenId: any;
  tokenSecretKey: any;
  accessToken: string;
  refreshToken: string;
}

export interface LeafUser {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    somarCredentials?: object;
    trimbleCredentials?: object;
    cnhiCredentials?: object;
    johnDeereCredentials?: JohnDeereCredentials;
    ravenCredentials?: object;
    climatempoCredentials?: object;
    climateFieldViewCredentials?: object;
}

export interface JohnDeereCredentials {
  id: string;
  clientKey?: string;
  clientSecret?: string;
  tokenId?: string;
  tokenSecretKey?: string;
}

export interface LeafToken {
  access_token?: string;
  timestamp?: string;
}

export interface LeafField {
  id: string;
  name: string;
  leafUserId: string;
  providerName: string;
  providerFieldName: string;
  providerId: number;
  providerFieldId: string;
  providerBoundaryId: string;
  organizationId: string;
  type: string;
  farmId: number;
  geometry: GeoJsonObject;
}

export interface LeafWebhookBase {
  type: string;
  timestamp: Date;
}

export interface LeafWebhookSync extends LeafWebhookBase {
  leafUserId: string;
  fieldId: string;
  source: string;
}

export interface StagingData {
  id: string;
  email: string;
  fieldId?: string;
  groupId: string;
  fullGroupAccess: boolean;
  status: string;
}
