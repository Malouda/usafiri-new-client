import { Building2, User, Mail, Phone, MapPin, FileText, CheckCircle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function BusinessRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    subdomain: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    phone: "",
    registrationNumber: "",
    address: "",
    businessType: "",
    description: ""
  });

  const steps = [
    { id: 1, title: "Business Information", description: "Basic business details" },
    { id: 2, title: "Owner Details", description: "Business owner information" },
    { id: 3, title: "Additional Info", description: "Registration and contact details" },
    { id: 4, title: "Review & Submit", description: "Review and complete registration" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting business registration:", formData);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Business Registration</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="max-w-4xl mx-auto">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                        currentStep >= step.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                      </div>
                      <div className="ml-3">
                        <div className={`text-xs font-medium ${
                          currentStep >= step.id ? 'text-foreground' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border-gray-200">
                <div className="p-6">
                  {/* Step 1: Business Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-4 w-4 text-gray-600" />
                        <h2 className="text-sm font-semibold text-foreground">Business Information</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessName" className="text-xs text-gray-600">Business Name *</Label>
                          <Input 
                            id="businessName" 
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            placeholder="Monrize Store" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="subdomain" className="text-xs text-gray-600">Subdomain (Optional)</Label>
                          <Input 
                            id="subdomain" 
                            value={formData.subdomain}
                            onChange={(e) => handleInputChange('subdomain', e.target.value)}
                            placeholder="monrize" 
                            className="h-8 text-xs border-gray-200" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Will be auto-generated if not provided</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessType" className="text-xs text-gray-600">Business Type</Label>
                          <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                            <SelectTrigger className="h-8 text-xs border-gray-200">
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retail" className="text-xs">Retail Store</SelectItem>
                              <SelectItem value="wholesale" className="text-xs">Wholesale</SelectItem>
                              <SelectItem value="restaurant" className="text-xs">Restaurant</SelectItem>
                              <SelectItem value="pharmacy" className="text-xs">Pharmacy</SelectItem>
                              <SelectItem value="other" className="text-xs">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="registrationNumber" className="text-xs text-gray-600">Registration Number</Label>
                          <Input 
                            id="registrationNumber" 
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                            placeholder="123456789" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-xs text-gray-600">Business Description</Label>
                        <Textarea 
                          id="description" 
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Brief description of your business..." 
                          className="text-xs border-gray-200" 
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Owner Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-4 w-4 text-gray-600" />
                        <h2 className="text-sm font-semibold text-foreground">Owner Details</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ownerName" className="text-xs text-gray-600">Full Name *</Label>
                          <Input 
                            id="ownerName" 
                            value={formData.ownerName}
                            onChange={(e) => handleInputChange('ownerName', e.target.value)}
                            placeholder="John Doe" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="ownerEmail" className="text-xs text-gray-600">Email Address *</Label>
                          <Input 
                            id="ownerEmail" 
                            type="email"
                            value={formData.ownerEmail}
                            onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                            placeholder="john@monrize.co.tz" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password" className="text-xs text-gray-600">Password *</Label>
                          <Input 
                            id="password" 
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="••••••••" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs text-gray-600">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+255 714 123 456" 
                            className="h-8 text-xs border-gray-200" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Additional Info */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <h2 className="text-sm font-semibold text-foreground">Additional Information</h2>
                      </div>
                      
                      <div>
                        <Label htmlFor="address" className="text-xs text-gray-600">Business Address</Label>
                        <Textarea 
                          id="address" 
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Street address, city, region..." 
                          className="text-xs border-gray-200" 
                          rows={3}
                        />
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h3 className="text-xs font-medium text-foreground mb-2">What happens next?</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Your business account will be created</li>
                          <li>• You'll be set up as the Manager with full access</li>
                          <li>• You can start adding products and managing inventory</li>
                          <li>• You can invite team members to join your business</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <h2 className="text-sm font-semibold text-foreground">Review & Submit</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-medium text-foreground mb-2">Business Information</h3>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><strong>Name:</strong> {formData.businessName}</div>
                              <div><strong>Type:</strong> {formData.businessType || 'Not specified'}</div>
                              <div><strong>Registration:</strong> {formData.registrationNumber || 'Not provided'}</div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-foreground mb-2">Owner Information</h3>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><strong>Name:</strong> {formData.ownerName}</div>
                              <div><strong>Email:</strong> {formData.ownerEmail}</div>
                              <div><strong>Phone:</strong> {formData.phone || 'Not provided'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {formData.description && (
                          <div>
                            <h3 className="text-xs font-medium text-foreground mb-2">Description</h3>
                            <p className="text-xs text-gray-600">{formData.description}</p>
                          </div>
                        )}
                        
                        {formData.address && (
                          <div>
                            <h3 className="text-xs font-medium text-foreground mb-2">Address</h3>
                            <p className="text-xs text-gray-600">{formData.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="h-8 text-xs border-gray-200"
                    >
                      Previous
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button 
                        onClick={nextStep}
                        className="h-8 text-xs"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit}
                        className="h-8 text-xs"
                      >
                        Complete Registration
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
