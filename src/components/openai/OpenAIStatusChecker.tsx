
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Settings, RefreshCw } from "lucide-react";
import { useOpenAIStatus } from "@/hooks/useOpenAIStatus";

const OpenAIStatusChecker = () => {
  const { status, isChecking, checkStatus } = useOpenAIStatus();

  const getStatusIcon = (isGood: boolean) => {
    return isGood ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isGood: boolean, label: string) => {
    return (
      <Badge variant={isGood ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(isGood)}
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          OpenAI Configuration Status
        </CardTitle>
        <CardDescription>
          Check if your OpenAI setup is configured correctly for mugshot generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkStatus} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking Status...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Check OpenAI Status
            </>
          )}
        </Button>

        {status && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Configuration Status</h4>
                <div className="space-y-1">
                  {getStatusBadge(status.hasValidKey, "API Key Valid")}
                  {getStatusBadge(status.hasBilling, "Billing Active")}
                  {getStatusBadge(status.hasQuota, "Quota Available")}
                  {getStatusBadge(status.canGenerateImages, "Image Generation Ready")}
                </div>
              </div>

              {status.details && Object.keys(status.details).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {status.details.modelsCount && (
                      <p>Models Available: {status.details.modelsCount}</p>
                    )}
                    {status.details.testImageUrl && (
                      <p className="text-green-600">✓ Test image generated successfully</p>
                    )}
                    {status.details.quotaError && (
                      <p className="text-red-600">⚠ Quota exceeded</p>
                    )}
                    {status.details.billingError && (
                      <p className="text-red-600">⚠ Billing not active</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {status.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Issues Found
                </h4>
                <ul className="text-sm space-y-1">
                  {status.errors.map((error, index) => (
                    <li key={index} className="text-red-600 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {status.canGenerateImages ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm font-medium">
                  ✓ Your OpenAI setup is working correctly and ready to generate mugshots!
                </p>
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm font-medium">
                  ⚠ OpenAI setup needs attention before mugshot generation will work.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenAIStatusChecker;
