import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Lock,
  Key,
  Database,
  Download,
  Upload,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Trash2,
  Plus,
  Copy,
  RefreshCw,
  HardDrive,
  Cloud,
  Server,
  Globe,
  UserCheck,
  FileCheck,
  Calendar,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EncryptionStatus {
  dataAtRest: boolean;
  dataInTransit: boolean;
  backups: boolean;
  logs: boolean;
  lastUpdated: Date;
}

interface BackupConfig {
  id: string;
  name: string;
  type: "full" | "incremental" | "differential";
  frequency: "daily" | "weekly" | "monthly";
  retention: number; // days
  location: "local" | "cloud" | "offsite";
  encrypted: boolean;
  lastBackup?: Date;
  nextBackup: Date;
  size?: string;
  status: "active" | "paused" | "failed";
}

interface ComplianceStatus {
  gdpr: {
    enabled: boolean;
    dataRetentionPeriod: number;
    rightToBeDeleted: boolean;
    dataPortability: boolean;
    consentManagement: boolean;
    lastAudit?: Date;
  };
  hipaa: {
    enabled: boolean;
    accessLogging: boolean;
    dataEncryption: boolean;
    userTraining: boolean;
    lastAssessment?: Date;
  };
  sox: {
    enabled: boolean;
    financialControls: boolean;
    auditTrail: boolean;
    changeManagement: boolean;
    lastReview?: Date;
  };
  iso27001: {
    enabled: boolean;
    riskAssessment: boolean;
    securityPolicies: boolean;
    incidentResponse: boolean;
    lastCertification?: Date;
  };
}

interface SecurityIncident {
  id: string;
  type:
    | "data_breach"
    | "unauthorized_access"
    | "malware"
    | "phishing"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedUsers: number;
  status: "open" | "investigating" | "resolved" | "closed";
  reportedAt: Date;
  resolvedAt?: Date;
  reportedBy: string;
  assignedTo?: string;
}

// Mock data
const mockEncryptionStatus: EncryptionStatus = {
  dataAtRest: true,
  dataInTransit: true,
  backups: true,
  logs: true,
  lastUpdated: new Date("2024-01-15T10:00:00Z"),
};

const mockBackups: BackupConfig[] = [
  {
    id: "backup1",
    name: "Daily Full Backup",
    type: "full",
    frequency: "daily",
    retention: 30,
    location: "cloud",
    encrypted: true,
    lastBackup: new Date("2024-01-15T02:00:00Z"),
    nextBackup: new Date("2024-01-16T02:00:00Z"),
    size: "2.3 GB",
    status: "active",
  },
  {
    id: "backup2",
    name: "Weekly Archive",
    type: "incremental",
    frequency: "weekly",
    retention: 90,
    location: "offsite",
    encrypted: true,
    lastBackup: new Date("2024-01-14T04:00:00Z"),
    nextBackup: new Date("2024-01-21T04:00:00Z"),
    size: "8.7 GB",
    status: "active",
  },
];

const mockCompliance: ComplianceStatus = {
  gdpr: {
    enabled: true,
    dataRetentionPeriod: 365,
    rightToBeDeleted: true,
    dataPortability: true,
    consentManagement: true,
    lastAudit: new Date("2024-01-01T10:00:00Z"),
  },
  hipaa: {
    enabled: false,
    accessLogging: false,
    dataEncryption: true,
    userTraining: false,
  },
  sox: {
    enabled: false,
    financialControls: false,
    auditTrail: true,
    changeManagement: false,
  },
  iso27001: {
    enabled: true,
    riskAssessment: true,
    securityPolicies: true,
    incidentResponse: true,
    lastCertification: new Date("2023-12-01T10:00:00Z"),
  },
};

const mockSecurityIncidents: SecurityIncident[] = [
  {
    id: "inc1",
    type: "unauthorized_access",
    severity: "medium",
    title: "Multiple failed login attempts detected",
    description:
      "Unusual login pattern detected from IP 203.0.113.1 with 15 failed attempts in 5 minutes",
    affectedUsers: 0,
    status: "resolved",
    reportedAt: new Date("2024-01-14T15:30:00Z"),
    resolvedAt: new Date("2024-01-14T16:45:00Z"),
    reportedBy: "Security System",
    assignedTo: "Security Team",
  },
  {
    id: "inc2",
    type: "other",
    severity: "low",
    title: "Suspicious API usage pattern",
    description:
      "Elevated API requests from single IP address outside normal business hours",
    affectedUsers: 0,
    status: "investigating",
    reportedAt: new Date("2024-01-15T09:15:00Z"),
    reportedBy: "Monitoring System",
    assignedTo: "DevOps Team",
  },
];

export function SecurityCompliance() {
  const { toast } = useToast();
  const [encryptionStatus, setEncryptionStatus] =
    useState<EncryptionStatus>(mockEncryptionStatus);
  const [backups, setBackups] = useState<BackupConfig[]>(mockBackups);
  const [compliance, setCompliance] =
    useState<ComplianceStatus>(mockCompliance);
  const [securityIncidents, setSecurityIncidents] = useState<
    SecurityIncident[]
  >(mockSecurityIncidents);
  const [showCreateBackupDialog, setShowCreateBackupDialog] = useState(false);

  const [newBackupData, setNewBackupData] = useState({
    name: "",
    type: "full" as const,
    frequency: "daily" as const,
    retention: 30,
    location: "cloud" as const,
    encrypted: true,
  });

  const handleCreateBackup = () => {
    if (!newBackupData.name) {
      toast({
        title: "Error",
        description: "Please provide a backup name",
        variant: "destructive",
      });
      return;
    }

    const newBackup: BackupConfig = {
      id: `backup_${Date.now()}`,
      ...newBackupData,
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: "active",
    };

    setBackups((prev) => [...prev, newBackup]);
    setNewBackupData({
      name: "",
      type: "full",
      frequency: "daily",
      retention: 30,
      location: "cloud",
      encrypted: true,
    });
    setShowCreateBackupDialog(false);

    toast({
      title: "Backup Created",
      description: "New backup configuration has been created",
    });
  };

  const handleRunBackup = (backupId: string) => {
    setBackups((prev) =>
      prev.map((backup) =>
        backup.id === backupId
          ? {
              ...backup,
              lastBackup: new Date(),
              size: `${(Math.random() * 5 + 1).toFixed(1)} GB`,
            }
          : backup,
      ),
    );

    toast({
      title: "Backup Started",
      description: "Backup process has been initiated",
    });
  };

  const handleDeleteBackup = (backupId: string) => {
    setBackups((prev) => prev.filter((backup) => backup.id !== backupId));
    toast({
      title: "Backup Deleted",
      description: "Backup configuration has been removed",
    });
  };

  const updateComplianceSetting = (
    framework: keyof ComplianceStatus,
    setting: string,
    value: any,
  ) => {
    setCompliance((prev) => ({
      ...prev,
      [framework]: {
        ...prev[framework],
        [setting]: value,
      },
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
      case "open":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "paused":
      case "investigating":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "failed":
      case "open":
        return "bg-red-100 text-red-800";
      case "paused":
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case "cloud":
        return <Cloud className="w-4 h-4" />;
      case "offsite":
        return <Globe className="w-4 h-4" />;
      case "local":
        return <HardDrive className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const calculateComplianceScore = () => {
    const frameworks = Object.values(compliance);
    const enabledFrameworks = frameworks.filter((f) => f.enabled);
    if (enabledFrameworks.length === 0) return 0;

    const totalChecks = enabledFrameworks.reduce((sum, framework) => {
      return (
        sum +
        Object.values(framework).filter((v) => typeof v === "boolean").length -
        1
      ); // -1 for enabled field
    }, 0);

    const passedChecks = enabledFrameworks.reduce((sum, framework) => {
      return (
        sum + Object.values(framework).filter((v) => v === true).length - 1
      ); // -1 for enabled field
    }, 0);

    return Math.round((passedChecks / totalChecks) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Security & Compliance
          </h3>
          <p className="text-gray-600">
            Manage security settings, encryption, backups, and compliance
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Overview
              </CardTitle>
              <CardDescription>
                Your platform's security and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="font-medium">Security Score</h4>
                  <p className="text-3xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-gray-500">Excellent</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileCheck className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Compliance Score</h4>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculateComplianceScore()}%
                  </p>
                  <p className="text-sm text-gray-500">Good</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="w-10 h-10 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Data Protection</h4>
                  <p className="text-3xl font-bold text-purple-600">100%</p>
                  <p className="text-sm text-gray-500">Fully Encrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Encryption
                    </p>
                    <p className="text-lg font-bold text-green-600">Active</p>
                  </div>
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Backup
                    </p>
                    <p className="text-lg font-bold text-blue-600">2h ago</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Open Incidents
                    </p>
                    <p className="text-lg font-bold text-yellow-600">
                      {
                        securityIncidents.filter(
                          (i) =>
                            i.status === "open" || i.status === "investigating",
                        ).length
                      }
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Compliance
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      GDPR + ISO
                    </p>
                  </div>
                  <FileCheck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
              <CardDescription>
                Latest security events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Automated backup completed successfully
                    </div>
                    <div className="text-sm text-gray-500">
                      2 hours ago • 2.3 GB backed up to cloud storage
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium">Security scan completed</div>
                    <div className="text-sm text-gray-500">
                      6 hours ago • No vulnerabilities detected
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Security incident reported
                    </div>
                    <div className="text-sm text-gray-500">
                      1 day ago • Multiple failed login attempts detected
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Data Encryption Status
              </CardTitle>
              <CardDescription>
                Encryption settings for data protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Data at Rest</div>
                          <div className="text-sm text-gray-500">
                            Database and file storage
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          encryptionStatus.dataAtRest
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {encryptionStatus.dataAtRest
                          ? "Encrypted"
                          : "Not Encrypted"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Data in Transit</div>
                          <div className="text-sm text-gray-500">
                            API and web traffic
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          encryptionStatus.dataInTransit
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {encryptionStatus.dataInTransit
                          ? "TLS 1.3"
                          : "Not Encrypted"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <HardDrive className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Backup Encryption</div>
                          <div className="text-sm text-gray-500">
                            Backup files
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          encryptionStatus.backups
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {encryptionStatus.backups ? "AES-256" : "Not Encrypted"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Audit Logs</div>
                          <div className="text-sm text-gray-500">
                            Security and access logs
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          encryptionStatus.logs
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {encryptionStatus.logs ? "Encrypted" : "Not Encrypted"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">
                    Encryption Keys Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Key className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-medium">Master Key</div>
                      <div className="text-sm text-gray-500">RSA-4096</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <Key className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="font-medium">Data Encryption Key</div>
                      <div className="text-sm text-gray-500">AES-256</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg text-center">
                      <Key className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-medium">Backup Key</div>
                      <div className="text-sm text-gray-500">AES-256</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Encryption Best Practices
                      </h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>
                          • All data is encrypted using industry-standard
                          AES-256 encryption
                        </li>
                        <li>
                          • Encryption keys are rotated regularly and stored
                          securely
                        </li>
                        <li>• TLS 1.3 ensures secure data transmission</li>
                        <li>
                          • Zero-knowledge architecture protects your data
                          privacy
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Backup Management</h4>
            <Dialog
              open={showCreateBackupDialog}
              onOpenChange={setShowCreateBackupDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Backup Configuration</DialogTitle>
                  <DialogDescription>
                    Set up a new automated backup schedule
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupName">Backup Name</Label>
                    <Input
                      id="backupName"
                      placeholder="e.g., Weekly Archive"
                      value={newBackupData.name}
                      onChange={(e) =>
                        setNewBackupData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backupType">Type</Label>
                      <Select
                        value={newBackupData.type}
                        onValueChange={(value: any) =>
                          setNewBackupData((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="incremental">
                            Incremental
                          </SelectItem>
                          <SelectItem value="differential">
                            Differential
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        value={newBackupData.frequency}
                        onValueChange={(value: any) =>
                          setNewBackupData((prev) => ({
                            ...prev,
                            frequency: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="retention">Retention (days)</Label>
                      <Input
                        id="retention"
                        type="number"
                        value={newBackupData.retention}
                        onChange={(e) =>
                          setNewBackupData((prev) => ({
                            ...prev,
                            retention: parseInt(e.target.value) || 30,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={newBackupData.location}
                        onValueChange={(value: any) =>
                          setNewBackupData((prev) => ({
                            ...prev,
                            location: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="cloud">Cloud</SelectItem>
                          <SelectItem value="offsite">Offsite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newBackupData.encrypted}
                      onCheckedChange={(checked) =>
                        setNewBackupData((prev) => ({
                          ...prev,
                          encrypted: checked,
                        }))
                      }
                    />
                    <Label>Encrypt backup</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateBackupDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBackup}>Create Backup</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {backups.map((backup) => (
              <Card key={backup.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{backup.name}</span>
                        {backup.encrypted && (
                          <Lock className="w-4 h-4 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {backup.type} backup • {backup.frequency}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Location</div>
                      <div className="flex items-center space-x-2">
                        {getLocationIcon(backup.location)}
                        <span className="capitalize">{backup.location}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Retention</div>
                      <div>{backup.retention} days</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Last Backup</div>
                      <div>
                        {backup.lastBackup
                          ? backup.lastBackup.toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Size</div>
                      <div>{backup.size || "N/A"}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Next Backup
                    </div>
                    <div className="text-sm font-medium">
                      {backup.nextBackup.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunBackup(backup.id)}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Run Now
                    </Button>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Backup Configuration
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the backup configuration and all
                              associated backup files. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Backup Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">3-2-1 Rule</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep 3 copies of important data</li>
                    <li>• Store 2 backup copies on different storage media</li>
                    <li>• Keep 1 backup copy offsite</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Security</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Always encrypt backup data</li>
                    <li>• Test backup restoration regularly</li>
                    <li>• Monitor backup job success/failure</li>
                    <li>• Implement proper access controls</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* GDPR */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>GDPR Compliance</span>
                  <Switch
                    checked={compliance.gdpr.enabled}
                    onCheckedChange={(checked) =>
                      updateComplianceSetting("gdpr", "enabled", checked)
                    }
                  />
                </CardTitle>
                <CardDescription>
                  General Data Protection Regulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Retention Period</span>
                    <Input
                      type="number"
                      value={compliance.gdpr.dataRetentionPeriod}
                      onChange={(e) =>
                        updateComplianceSetting(
                          "gdpr",
                          "dataRetentionPeriod",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-20"
                      disabled={!compliance.gdpr.enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Right to be Deleted</span>
                      <Switch
                        checked={compliance.gdpr.rightToBeDeleted}
                        onCheckedChange={(checked) =>
                          updateComplianceSetting(
                            "gdpr",
                            "rightToBeDeleted",
                            checked,
                          )
                        }
                        disabled={!compliance.gdpr.enabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Portability</span>
                      <Switch
                        checked={compliance.gdpr.dataPortability}
                        onCheckedChange={(checked) =>
                          updateComplianceSetting(
                            "gdpr",
                            "dataPortability",
                            checked,
                          )
                        }
                        disabled={!compliance.gdpr.enabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consent Management</span>
                      <Switch
                        checked={compliance.gdpr.consentManagement}
                        onCheckedChange={(checked) =>
                          updateComplianceSetting(
                            "gdpr",
                            "consentManagement",
                            checked,
                          )
                        }
                        disabled={!compliance.gdpr.enabled}
                      />
                    </div>
                  </div>
                  {compliance.gdpr.lastAudit && (
                    <div className="text-sm text-gray-600">
                      Last audit:{" "}
                      {compliance.gdpr.lastAudit.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ISO 27001 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ISO 27001</span>
                  <Switch
                    checked={compliance.iso27001.enabled}
                    onCheckedChange={(checked) =>
                      updateComplianceSetting("iso27001", "enabled", checked)
                    }
                  />
                </CardTitle>
                <CardDescription>
                  Information Security Management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Assessment</span>
                    <Switch
                      checked={compliance.iso27001.riskAssessment}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "iso27001",
                          "riskAssessment",
                          checked,
                        )
                      }
                      disabled={!compliance.iso27001.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security Policies</span>
                    <Switch
                      checked={compliance.iso27001.securityPolicies}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "iso27001",
                          "securityPolicies",
                          checked,
                        )
                      }
                      disabled={!compliance.iso27001.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Incident Response</span>
                    <Switch
                      checked={compliance.iso27001.incidentResponse}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "iso27001",
                          "incidentResponse",
                          checked,
                        )
                      }
                      disabled={!compliance.iso27001.enabled}
                    />
                  </div>
                </div>
                {compliance.iso27001.lastCertification && (
                  <div className="text-sm text-gray-600 mt-4">
                    Last certification:{" "}
                    {compliance.iso27001.lastCertification.toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* HIPAA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>HIPAA</span>
                  <Switch
                    checked={compliance.hipaa.enabled}
                    onCheckedChange={(checked) =>
                      updateComplianceSetting("hipaa", "enabled", checked)
                    }
                  />
                </CardTitle>
                <CardDescription>Health Insurance Portability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Logging</span>
                    <Switch
                      checked={compliance.hipaa.accessLogging}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "hipaa",
                          "accessLogging",
                          checked,
                        )
                      }
                      disabled={!compliance.hipaa.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Encryption</span>
                    <Switch
                      checked={compliance.hipaa.dataEncryption}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "hipaa",
                          "dataEncryption",
                          checked,
                        )
                      }
                      disabled={!compliance.hipaa.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Training</span>
                    <Switch
                      checked={compliance.hipaa.userTraining}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "hipaa",
                          "userTraining",
                          checked,
                        )
                      }
                      disabled={!compliance.hipaa.enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SOX */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>SOX</span>
                  <Switch
                    checked={compliance.sox.enabled}
                    onCheckedChange={(checked) =>
                      updateComplianceSetting("sox", "enabled", checked)
                    }
                  />
                </CardTitle>
                <CardDescription>Sarbanes-Oxley Act</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Financial Controls</span>
                    <Switch
                      checked={compliance.sox.financialControls}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "sox",
                          "financialControls",
                          checked,
                        )
                      }
                      disabled={!compliance.sox.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Trail</span>
                    <Switch
                      checked={compliance.sox.auditTrail}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting("sox", "auditTrail", checked)
                      }
                      disabled={!compliance.sox.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Change Management</span>
                    <Switch
                      checked={compliance.sox.changeManagement}
                      onCheckedChange={(checked) =>
                        updateComplianceSetting(
                          "sox",
                          "changeManagement",
                          checked,
                        )
                      }
                      disabled={!compliance.sox.enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
              <CardDescription>
                Overall compliance score: {calculateComplianceScore()}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={calculateComplianceScore()} className="mb-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Active Frameworks</h4>
                  <div className="space-y-1">
                    {Object.entries(compliance)
                      .filter(([, framework]) => framework.enabled)
                      .map(([key, framework]) => (
                        <Badge key={key} variant="outline" className="mr-2">
                          {key.toUpperCase()}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Next Actions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Schedule quarterly compliance review</li>
                    <li>• Update data retention policies</li>
                    <li>• Conduct security awareness training</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>
                Monitor and manage security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge
                            className={getSeverityColor(incident.severity)}
                          >
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {incident.reportedAt.toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{incident.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Reported by: {incident.reportedBy}</span>
                          {incident.assignedTo && (
                            <span>Assigned to: {incident.assignedTo}</span>
                          )}
                          {incident.affectedUsers > 0 && (
                            <span>
                              Affected users: {incident.affectedUsers}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
