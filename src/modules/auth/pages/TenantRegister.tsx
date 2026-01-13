import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { authApi } from "../auth.api";
import type { RegisterTenantRequest } from "../interfaces";

const TenantRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterTenantRequest>({
    organizationName: "",
    adminFirstName: "",
    adminLastName: "",
    adminPhone: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  const isFormValid = useMemo(() => {
    return (
      formData.organizationName.trim().length >= 3 &&
      formData.adminFirstName.trim() !== "" &&
      formData.adminLastName.trim() !== "" &&
      formData.adminPhone.trim() !== "" &&
      formData.password.trim().length >= 8 &&
      formData.password === formData.confirmPassword &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    );
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }

    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        organizationName: formData.organizationName,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminPhone: formData.adminPhone,
        adminEmail: formData.adminEmail || undefined,
        password: formData.password,
      };

      const response = await authApi.registerTenant(payload);

      toast.success("Organization created successfully", {
        description: `Welcome to ${response.tenant.name}! You have been logged in.`,
      });

      // Navigate to dashboard or home
      navigate("/", { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Unable to complete registration.";
      setError(errorMessage);
      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-gray-900 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-xs font-medium text-gray-600">Register Your Organization</h1>
          <p className="text-xs text-gray-600">Create a tenant account to manage your transport business.</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs text-center text-gray-600">Tenant Registration</CardTitle>
            <CardDescription className="text-center text-xs text-gray-600">
              Set up your organization and admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-medium text-gray-600 mb-3">Organization Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="text-xs text-gray-600">
                    Organization name
                  </Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    placeholder="Acme Transport Ltd"
                    value={formData.organizationName}
                    onChange={handleChange}
                    autoComplete="organization"
                    required
                    disabled={isLoading}
                    className="text-xs border-gray-200"
                  />
                  <p className="text-xs text-gray-600">Min 3 characters</p>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-medium text-gray-600 mb-3">Admin User Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName" className="text-xs text-gray-600">
                      First name
                    </Label>
                    <Input
                      id="adminFirstName"
                      name="adminFirstName"
                      type="text"
                      placeholder="John"
                      value={formData.adminFirstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      required
                      disabled={isLoading}
                      className="text-xs border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName" className="text-xs text-gray-600">
                      Last name
                    </Label>
                    <Input
                      id="adminLastName"
                      name="adminLastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      required
                      disabled={isLoading}
                      className="text-xs border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="adminPhone" className="text-xs text-gray-600">
                    Phone number
                  </Label>
                  <Input
                    id="adminPhone"
                    name="adminPhone"
                    type="tel"
                    placeholder="+255 712 345 678"
                    value={formData.adminPhone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    disabled={isLoading}
                    className="text-xs border-gray-200"
                  />
                  <p className="text-xs text-gray-600">Format: +255XXXXXXXXX</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-xs text-gray-600">
                    Email address (optional)
                  </Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    placeholder="john@acme.com"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={isLoading}
                    className="text-xs border-gray-200"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-600 mb-3">Security</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs text-gray-600">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      className="text-xs border-gray-200"
                    />
                    <p className="text-xs text-gray-600">
                      Min 8 chars, must include uppercase, lowercase, and number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs text-gray-600">
                      Confirm password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      className="text-xs border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating organization...
                  </>
                ) : (
                  "Create organization"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <Link className="font-medium text-gray-900 hover:underline" to="/auth/login">
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-center text-xs text-gray-600">
              Want to register as a rider?{" "}
              <Link className="font-medium text-gray-900 hover:underline" to="/auth/register-rider">
                Register as rider
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantRegister;
