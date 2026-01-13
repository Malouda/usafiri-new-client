import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useAppDispatch, useAppSelector } from "../../../store";
import { clearError, registerUser } from "../reducers/authReducer";
import type { RegisterRequest } from "../interfaces";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim().length >= 6 &&
      formData.password === formData.confirmPassword
    );
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch(clearError());
    }

    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isLoading) return;

    const response = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(response)) {
      toast.success("Account created", {
        description: "You can now sign in with your new credentials.",
      });
      navigate("/auth/login", { replace: true });
    } else if (registerUser.rejected.match(response)) {
      toast.error("Registration failed", {
        description: (response.payload as string) ?? "Unable to complete registration.",
      });
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
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-600">Fill in the details below to get started.</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Register</CardTitle>
            <CardDescription className="text-center text-sm text-gray-600">
              Create a new account for the Usafiri platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm text-gray-600">
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-600">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-gray-600">
                  Phone number (optional)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+255 700 000 000"
                  value={formData.phone ?? ""}
                  onChange={handleChange}
                  autoComplete="tel"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-gray-600">
                    Password (min 6 characters)
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm text-gray-600">
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={!isFormValid || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="font-medium text-gray-900 hover:underline" to="/auth/login">
                Sign in instead
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
