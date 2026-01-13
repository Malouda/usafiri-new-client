import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useAppDispatch, useAppSelector } from "../../../store";
import { clearError, loginUser } from "../reducers/authReducer";
import { LoginRequest } from "../interfaces";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginRequest>({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = useMemo(() => formData.phone.trim() !== "" && formData.password.trim() !== "", [formData]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

    const response = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(response)) {
      toast.success("Login successful", {
        description: `Welcome back ${response.payload.user.fullName}!`,
      });
      navigate("/dashboard", { replace: true });
    } else if (loginUser.rejected.match(response)) {
      toast.error("Login failed", {
        description: (response.payload as string) ?? "Invalid username or password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gray-900 p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your transport management dashboard</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-center text-sm text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-sm text-red-600">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-gray-600">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-600">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-gray-900 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link to="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-sm border-gray-200" disabled>
                  Google
                </Button>
                <Button variant="outline" className="text-sm border-gray-200" disabled>
                  Microsoft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-3">
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-gray-900 font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-600 mb-2">Register as:</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/auth/register-rider"
                className="text-xs text-gray-900 font-medium hover:underline border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Rider
              </Link>
              <Link
                to="/auth/register-tenant"
                className="text-xs text-gray-900 font-medium hover:underline border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Organization/Tenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
