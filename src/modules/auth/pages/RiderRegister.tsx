import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { authApi } from "../auth.api";
import type { RegisterRiderRequest } from "../interfaces";

const RiderRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegisterRiderRequest>({
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    tenantId: "",
  });

  const isFormValid = useMemo(() => {
    return (
      formData.phone.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
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
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        tenantId: formData.tenantId || undefined,
      };

      const response = await authApi.registerRider(payload);

      toast.success("Rider account created", {
        description: response.message || "Please verify your phone with the OTP sent.",
      });

      // Navigate to OTP verification page or login
      navigate("/auth/login", { replace: true });
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
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-gray-900 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-xs font-medium text-gray-600">Create Rider Account</h1>
          <p className="text-xs text-gray-600">Register as a rider to book trips.</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs text-center text-gray-600">Rider Registration</CardTitle>
            <CardDescription className="text-center text-xs text-gray-600">
              Fill in your details to create a rider account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-xs text-red-600">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-gray-600">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+255 712 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                  disabled={isLoading}
                  className="text-xs border-gray-200"
                />
                <p className="text-xs text-gray-600">Format: +255XXXXXXXXX</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs text-gray-600">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                    disabled={isLoading}
                    className="text-xs border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs text-gray-600">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                    disabled={isLoading}
                    className="text-xs border-gray-200"
                  />
                </div>
              </div>

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
                <p className="text-xs text-gray-600">Min 8 chars, must include uppercase, lowercase, and number</p>
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

              <div className="space-y-2">
                <Label htmlFor="tenantId" className="text-xs text-gray-600">
                  Organization ID (optional)
                </Label>
                <Input
                  id="tenantId"
                  name="tenantId"
                  type="text"
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                  value={formData.tenantId}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="text-xs border-gray-200"
                />
                <p className="text-xs text-gray-600">Leave blank for general registration</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create rider account"
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
              Want to register an organization?{" "}
              <Link className="font-medium text-gray-900 hover:underline" to="/auth/register-tenant">
                Register as tenant
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiderRegister;
