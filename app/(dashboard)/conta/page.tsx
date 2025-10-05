"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useBranding } from "@/hooks/use-branding";
import { Palette } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { branding, saveBranding } = useBranding();
  const [brandName, setBrandName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (branding) {
      setBrandName(branding.brandName);
      setPrimaryColor(branding.primaryColor);
    }
  }, [branding]);

  if (!user || user.role !== "teacher") {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBranding({
      brandName,
      primaryColor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conta</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Seus dados de professor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Nome</Label>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Tipo de Conta</Label>
              <p className="text-sm font-medium">Professor</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
