export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_learning_data: {
        Row: {
          confidence_score: number | null
          created_at: string
          data_type: string
          features: Json
          id: string
          label: string | null
          model_version: string | null
          organization_id: string | null
          processed_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          data_type: string
          features: Json
          id?: string
          label?: string | null
          model_version?: string | null
          organization_id?: string | null
          processed_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          data_type?: string
          features?: Json
          id?: string
          label?: string | null
          model_version?: string | null
          organization_id?: string | null
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_learning_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_audit_logs: {
        Row: {
          block_number: number
          blockchain_tx_id: string | null
          created_at: string
          data_hash: string
          event_data: Json
          event_type: string
          id: string
          is_synced_to_chain: boolean | null
          organization_id: string | null
          previous_hash: string | null
          user_id: string | null
        }
        Insert: {
          block_number?: never
          blockchain_tx_id?: string | null
          created_at?: string
          data_hash: string
          event_data: Json
          event_type: string
          id?: string
          is_synced_to_chain?: boolean | null
          organization_id?: string | null
          previous_hash?: string | null
          user_id?: string | null
        }
        Update: {
          block_number?: never
          blockchain_tx_id?: string | null
          created_at?: string
          data_hash?: string
          event_data?: Json
          event_type?: string
          id?: string
          is_synced_to_chain?: boolean | null
          organization_id?: string | null
          previous_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clock_events: {
        Row: {
          confidence: number | null
          created_at: string
          device_id: string | null
          event_type: string
          id: string
          location: Json | null
          method: string
          notes: string | null
          organization_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          device_id?: string | null
          event_type: string
          id?: string
          location?: Json | null
          method: string
          notes?: string | null
          organization_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          device_id?: string | null
          event_type?: string
          id?: string
          location?: Json | null
          method?: string
          notes?: string | null
          organization_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clock_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      colony_hub_data: {
        Row: {
          created_at: string | null
          data: Json | null
          hub_id: string
          id: string
          last_sync: string | null
          status: string | null
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          hub_id: string
          id?: string
          last_sync?: string | null
          status?: string | null
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          hub_id?: string
          id?: string
          last_sync?: string | null
          status?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colony_hub_data_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      device_auth: {
        Row: {
          auth_method: string
          created_at: string | null
          device_id: string
          device_uuid: string
          failed_auth_attempts: number | null
          id: string
          is_locked: boolean | null
          last_auth_at: string | null
          public_key: string | null
          secret_key_hash: string
          updated_at: string | null
        }
        Insert: {
          auth_method?: string
          created_at?: string | null
          device_id: string
          device_uuid: string
          failed_auth_attempts?: number | null
          id?: string
          is_locked?: boolean | null
          last_auth_at?: string | null
          public_key?: string | null
          secret_key_hash: string
          updated_at?: string | null
        }
        Update: {
          auth_method?: string
          created_at?: string | null
          device_id?: string
          device_uuid?: string
          failed_auth_attempts?: number | null
          id?: string
          is_locked?: boolean | null
          last_auth_at?: string | null
          public_key?: string | null
          secret_key_hash?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_auth_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_commands: {
        Row: {
          acknowledged_at: string | null
          command_type: string
          created_at: string | null
          device_id: string
          expires_at: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          payload: Json | null
          priority: number | null
          result: Json | null
          sent_at: string | null
          status: string
        }
        Insert: {
          acknowledged_at?: string | null
          command_type: string
          created_at?: string | null
          device_id: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          payload?: Json | null
          priority?: number | null
          result?: Json | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          acknowledged_at?: string | null
          command_type?: string
          created_at?: string | null
          device_id?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          payload?: Json | null
          priority?: number | null
          result?: Json | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_data: {
        Row: {
          battery_level: number | null
          created_at: string | null
          data_type: string
          device_id: string
          gps_location: Json | null
          id: string
          payload: Json
          rssi: number | null
          timestamp: string
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          data_type: string
          device_id: string
          gps_location?: Json | null
          id?: string
          payload: Json
          rssi?: number | null
          timestamp?: string
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          data_type?: string
          device_id?: string
          gps_location?: Json | null
          id?: string
          payload?: Json
          rssi?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_diagnostics: {
        Row: {
          device_id: string
          diagnostic_type: string
          id: string
          metrics: Json
          recommendations: string[] | null
          status: string
          timestamp: string
        }
        Insert: {
          device_id: string
          diagnostic_type: string
          id?: string
          metrics: Json
          recommendations?: string[] | null
          status: string
          timestamp?: string
        }
        Update: {
          device_id?: string
          diagnostic_type?: string
          id?: string
          metrics?: Json
          recommendations?: string[] | null
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_diagnostics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_firmware: {
        Row: {
          changelog: string | null
          created_at: string | null
          device_type_id: string
          file_hash: string
          file_url: string
          id: string
          is_stable: boolean | null
          min_battery_level: number | null
          released_at: string | null
          version: string
        }
        Insert: {
          changelog?: string | null
          created_at?: string | null
          device_type_id: string
          file_hash: string
          file_url: string
          id?: string
          is_stable?: boolean | null
          min_battery_level?: number | null
          released_at?: string | null
          version: string
        }
        Update: {
          changelog?: string | null
          created_at?: string | null
          device_type_id?: string
          file_hash?: string
          file_url?: string
          id?: string
          is_stable?: boolean | null
          min_battery_level?: number | null
          released_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_firmware_device_type_id_fkey"
            columns: ["device_type_id"]
            isOneToOne: false
            referencedRelation: "device_types"
            referencedColumns: ["id"]
          },
        ]
      }
      device_types: {
        Row: {
          capabilities: Json
          category: string
          command_schema: Json | null
          communication_protocol: string
          created_at: string | null
          data_schema: Json | null
          firmware_version: string | null
          id: string
          manufacturer: string
          model: string
          name: string
          updated_at: string | null
        }
        Insert: {
          capabilities?: Json
          category: string
          command_schema?: Json | null
          communication_protocol: string
          created_at?: string | null
          data_schema?: Json | null
          firmware_version?: string | null
          id?: string
          manufacturer: string
          model: string
          name: string
          updated_at?: string | null
        }
        Update: {
          capabilities?: Json
          category?: string
          command_schema?: Json | null
          communication_protocol?: string
          created_at?: string | null
          data_schema?: Json | null
          firmware_version?: string | null
          id?: string
          manufacturer?: string
          model?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          battery_level: number | null
          created_at: string | null
          device_id: string
          device_type_id: string
          firmware_version: string | null
          id: string
          last_seen: string | null
          location: Json | null
          mac_address: string | null
          metadata: Json | null
          name: string | null
          organization_id: string | null
          paired_at: string | null
          paired_by: string | null
          serial_number: string | null
          signal_strength: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          device_id: string
          device_type_id: string
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location?: Json | null
          mac_address?: string | null
          metadata?: Json | null
          name?: string | null
          organization_id?: string | null
          paired_at?: string | null
          paired_by?: string | null
          serial_number?: string | null
          signal_strength?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          device_id?: string
          device_type_id?: string
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location?: Json | null
          mac_address?: string | null
          metadata?: Json | null
          name?: string | null
          organization_id?: string | null
          paired_at?: string | null
          paired_by?: string | null
          serial_number?: string | null
          signal_strength?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_device_type_id_fkey"
            columns: ["device_type_id"]
            isOneToOne: false
            referencedRelation: "device_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      face_embeddings: {
        Row: {
          created_at: string
          embedding: Json
          enrollment_confidence: number | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embedding: Json
          enrollment_confidence?: number | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          embedding?: Json
          enrollment_confidence?: number | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "face_embeddings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      firmware_versions: {
        Row: {
          build_number: number
          changelog: string | null
          created_at: string | null
          deprecated_at: string | null
          device_type_id: string
          file_hash: string
          file_size_bytes: number
          file_url: string
          id: string
          is_mandatory: boolean | null
          min_battery_level: number | null
          release_channel: string
          released_at: string | null
          requires_backup: boolean | null
          rollback_version: string | null
          signature: string
          version: string
        }
        Insert: {
          build_number: number
          changelog?: string | null
          created_at?: string | null
          deprecated_at?: string | null
          device_type_id: string
          file_hash: string
          file_size_bytes: number
          file_url: string
          id?: string
          is_mandatory?: boolean | null
          min_battery_level?: number | null
          release_channel?: string
          released_at?: string | null
          requires_backup?: boolean | null
          rollback_version?: string | null
          signature: string
          version: string
        }
        Update: {
          build_number?: number
          changelog?: string | null
          created_at?: string | null
          deprecated_at?: string | null
          device_type_id?: string
          file_hash?: string
          file_size_bytes?: number
          file_url?: string
          id?: string
          is_mandatory?: boolean | null
          min_battery_level?: number | null
          release_channel?: string
          released_at?: string | null
          requires_backup?: boolean | null
          rollback_version?: string | null
          signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "firmware_versions_device_type_id_fkey"
            columns: ["device_type_id"]
            isOneToOne: false
            referencedRelation: "device_types"
            referencedColumns: ["id"]
          },
        ]
      }
      invepin_data: {
        Row: {
          battery_level: number | null
          created_at: string | null
          data: Json | null
          id: string
          invepin_id: string
          item_name: string | null
          last_detected: string | null
          location: string | null
          product_id: string | null
          store_id: string | null
          upc: string | null
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          invepin_id: string
          item_name?: string | null
          last_detected?: string | null
          location?: string | null
          product_id?: string | null
          store_id?: string | null
          upc?: string | null
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          invepin_id?: string
          item_name?: string | null
          last_detected?: string | null
          location?: string | null
          product_id?: string | null
          store_id?: string | null
          upc?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invepin_data_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invepin_data_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          company_code: string
          company_size: string
          created_at: string | null
          id: string
          industry: string
          is_active: boolean | null
          location: string
          logo_url: string | null
          name: string
          primary_color: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          company_code: string
          company_size: string
          created_at?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          location: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          company_code?: string
          company_size?: string
          created_at?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          location?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ota_updates: {
        Row: {
          completed_at: string | null
          created_at: string | null
          device_id: string
          error_message: string | null
          firmware_version_id: string
          id: string
          initiated_by: string | null
          max_retries: number | null
          priority: number | null
          progress_percent: number | null
          retry_count: number | null
          rollback_version: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          device_id: string
          error_message?: string | null
          firmware_version_id: string
          id?: string
          initiated_by?: string | null
          max_retries?: number | null
          priority?: number | null
          progress_percent?: number | null
          retry_count?: number | null
          rollback_version?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          device_id?: string
          error_message?: string | null
          firmware_version_id?: string
          id?: string
          initiated_by?: string | null
          max_retries?: number | null
          priority?: number | null
          progress_percent?: number | null
          retry_count?: number | null
          rollback_version?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ota_updates_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ota_updates_firmware_version_id_fkey"
            columns: ["firmware_version_id"]
            isOneToOne: false
            referencedRelation: "firmware_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_approvals: {
        Row: {
          created_at: string | null
          department: string
          email: string
          employee_id: string
          full_name: string
          id: string
          organization_id: string | null
          phone: string | null
          position: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          employee_id: string
          full_name: string
          id?: string
          organization_id?: string | null
          phone?: string | null
          position: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          employee_id?: string
          full_name?: string
          id?: string
          organization_id?: string | null
          phone?: string | null
          position?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_approvals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      pour_events: {
        Row: {
          authorized_method: string | null
          device_id: string
          duration_seconds: number | null
          flow_rate: number | null
          id: string
          metadata: Json | null
          organization_id: string
          product_name: string | null
          tamper_detected: boolean | null
          timestamp: string
          user_id: string | null
          volume_ml: number
        }
        Insert: {
          authorized_method?: string | null
          device_id: string
          duration_seconds?: number | null
          flow_rate?: number | null
          id?: string
          metadata?: Json | null
          organization_id: string
          product_name?: string | null
          tamper_detected?: boolean | null
          timestamp?: string
          user_id?: string | null
          volume_ml: number
        }
        Update: {
          authorized_method?: string | null
          device_id?: string
          duration_seconds?: number | null
          flow_rate?: number | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          product_name?: string | null
          tamper_detected?: boolean | null
          timestamp?: string
          user_id?: string | null
          volume_ml?: number
        }
        Relationships: [
          {
            foreignKeyName: "pour_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pour_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_analytics: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          organization_id: string | null
          prediction_type: string
          predictions: Json
          target_date: string
          valid_until: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          organization_id?: string | null
          prediction_type: string
          predictions: Json
          target_date: string
          valid_until: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          organization_id?: string | null
          prediction_type?: string
          predictions?: Json
          target_date?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictive_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          manufacturer: string | null
          name: string
          upc: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name: string
          upc: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name?: string
          upc?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          employee_id: string | null
          facial_recognition_consent_date: string | null
          facial_recognition_consent_signed: boolean | null
          full_name: string
          id: string
          is_approved: boolean | null
          organization_id: string | null
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          facial_recognition_consent_date?: string | null
          facial_recognition_consent_signed?: boolean | null
          full_name: string
          id: string
          is_approved?: boolean | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          facial_recognition_consent_date?: string | null
          facial_recognition_consent_signed?: boolean | null
          full_name?: string
          id?: string
          is_approved?: boolean | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_records: {
        Row: {
          break_duration_minutes: number | null
          clock_in_id: string | null
          clock_in_time: string
          clock_out_id: string | null
          clock_out_time: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          notes: string | null
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          break_duration_minutes?: number | null
          clock_in_id?: string | null
          clock_in_time: string
          clock_out_id?: string | null
          clock_out_time?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          break_duration_minutes?: number | null
          clock_in_id?: string | null
          clock_in_time?: string
          clock_out_id?: string | null
          clock_out_time?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_records_clock_in_id_fkey"
            columns: ["clock_in_id"]
            isOneToOne: false
            referencedRelation: "clock_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_records_clock_out_id_fkey"
            columns: ["clock_out_id"]
            isOneToOne: false
            referencedRelation: "clock_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_contract_logs: {
        Row: {
          contract_data: Json
          contract_type: string
          created_at: string
          executed_at: string | null
          executed_by: string | null
          gas_equivalent: number | null
          id: string
          organization_id: string | null
          status: string
        }
        Insert: {
          contract_data: Json
          contract_type: string
          created_at?: string
          executed_at?: string | null
          executed_by?: string | null
          gas_equivalent?: number | null
          id?: string
          organization_id?: string | null
          status?: string
        }
        Update: {
          contract_data?: Json
          contract_type?: string
          created_at?: string
          executed_at?: string | null
          executed_by?: string | null
          gas_equivalent?: number | null
          id?: string
          organization_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_contract_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          app_enabled: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          app_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          app_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tamper_events: {
        Row: {
          details: Json | null
          device_id: string
          event_type: string
          id: string
          organization_id: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          timestamp: string
        }
        Insert: {
          details?: Json | null
          device_id: string
          event_type: string
          id?: string
          organization_id: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          timestamp?: string
        }
        Update: {
          details?: Json | null
          device_id?: string
          event_type?: string
          id?: string
          organization_id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "tamper_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tamper_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_text: string
          consent_type: string
          consented_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_text: string
          consent_type: string
          consented_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          version?: string
        }
        Update: {
          consent_text?: string
          consent_type?: string
          consented_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_security: {
        Row: {
          account_locked_until: string | null
          created_at: string | null
          failed_login_attempts: number | null
          id: string
          last_mfa_verification: string | null
          mfa_enabled: boolean | null
          mfa_phone: string | null
          mfa_phone_verified: boolean | null
          password_expires_at: string | null
          password_last_changed: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_locked_until?: string | null
          created_at?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_mfa_verification?: string | null
          mfa_enabled?: boolean | null
          mfa_phone?: string | null
          mfa_phone_verified?: boolean | null
          password_expires_at?: string | null
          password_last_changed?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_locked_until?: string | null
          created_at?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_mfa_verification?: string | null
          mfa_enabled?: boolean | null
          mfa_phone?: string | null
          mfa_phone_verified?: boolean | null
          password_expires_at?: string | null
          password_last_changed?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_audit_hash: {
        Args: { event_data: Json; previous_hash: string }
        Returns: string
      }
      generate_company_code: { Args: { company_name: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_password_expired: { Args: { _user_id: string }; Returns: boolean }
      record_failed_login: { Args: { _user_id: string }; Returns: undefined }
      reset_failed_logins: { Args: { _user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "company_admin"
        | "manager"
        | "bartender"
        | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "company_admin",
        "manager",
        "bartender",
        "staff",
      ],
    },
  },
} as const
