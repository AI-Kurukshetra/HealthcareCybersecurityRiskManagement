import type { UserRole } from "@/types/database";

export type Permission =
  | "manage_users"
  | "view_audit_logs"
  | "view_dashboard_audit_stream"
  | "create_device"
  | "edit_device"
  | "delete_device"
  | "create_vulnerability"
  | "edit_vulnerability"
  | "delete_vulnerability"
  | "create_incident"
  | "edit_incident"
  | "delete_incident"
  | "create_compliance_check"
  | "edit_compliance_check"
  | "delete_compliance_check"
  | "generate_reports"
  | "run_risk_assessment"
  | "create_vendor"
  | "edit_vendor"
  | "delete_vendor"
  | "assign_training"
  | "edit_training"
  | "create_backup_job"
  | "edit_backup_job"
  | "edit_alert";

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "manage_users",
    "view_audit_logs",
    "view_dashboard_audit_stream",
    "create_device",
    "edit_device",
    "delete_device",
    "create_vulnerability",
    "edit_vulnerability",
    "delete_vulnerability",
    "create_incident",
    "edit_incident",
    "delete_incident",
    "create_compliance_check",
    "edit_compliance_check",
    "delete_compliance_check",
    "generate_reports",
    "run_risk_assessment",
    "create_vendor",
    "edit_vendor",
    "delete_vendor",
    "assign_training",
    "edit_training",
    "create_backup_job",
    "edit_backup_job",
    "edit_alert",
  ],
  analyst: [
    "view_audit_logs",
    "view_dashboard_audit_stream",
    "create_device",
    "edit_device",
    "create_vulnerability",
    "edit_vulnerability",
    "create_incident",
    "edit_incident",
    "edit_compliance_check",
    "generate_reports",
    "run_risk_assessment",
    "edit_vendor",
    "edit_training",
    "edit_backup_job",
    "edit_alert",
  ],
  auditor: [],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function getRoleLabel(role: UserRole) {
  if (role === "analyst") {
    return "Security Analyst";
  }

  if (role === "auditor") {
    return "Viewer / Staff";
  }

  return "Admin";
}

export class PermissionError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "PermissionError";
  }
}
