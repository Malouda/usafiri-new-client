import { Search, Trash2, ShoppingCart, Plus, Minus, CreditCard, Banknote, Smartphone } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function POS() {
  const cartItems = [
    { id: 1, name: "Coca Cola 500ml", type: "Pack", qty: 2, price: 1200, total: 2400 },
    { id: 2, name: "Bread Loaf", type: "Each", qty: 5, price: 800, total: 4000 },
  ];

  const products = [
    { id: 1, name: "Coca Cola 500ml", price: 1200, stock: 156, category: "Beverages" },
    { id: 2, name: "Bread Loaf", price: 800, stock: 45, category: "Bakery" },
    { id: 3, name: "Rice 1kg", price: 2500, stock: 89, category: "Grains" },
    { id: 4, name: "Milk 1L", price: 1500, stock: 23, category: "Dairy" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xs font-semibold text-foreground">Point of Sale</h1>
            </div>
          </header>

          <main className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-3 gap-4 h-[calc(100vh-5rem)]">
              {/* Products Section */}
              <div className="col-span-2">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600" />
                    <Input placeholder="Search products..." className="pl-7 h-8 text-xs border-gray-200" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {products.map((product) => (
                    <Card key={product.id} className="p-3 border-gray-200 cursor-pointer hover:border-primary transition-colors">
                      <div className="text-xs font-medium text-foreground mb-1">{product.name}</div>
                      <div className="text-xs text-gray-600 mb-1">{product.category}</div>
                      <div className="text-xs font-semibold text-foreground mb-1">{product.price.toLocaleString()} TZS</div>
                      <Badge variant="outline" className="text-xs border-gray-200">Stock: {product.stock}</Badge>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="flex flex-col">
                <Card className="border-gray-200 flex-1 flex flex-col">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-gray-600" />
                      <h2 className="text-xs font-semibold text-foreground">Current Sale</h2>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    {cartItems.length === 0 ? (
                      <div className="text-center text-xs text-gray-600 py-8">No items in cart</div>
                    ) : (
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="p-2 border border-gray-200 rounded">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1">
                                <div className="text-xs font-medium text-foreground">{item.name}</div>
                                <Badge variant="outline" className="text-xs mt-1 border-gray-200">{item.type}</Badge>
                              </div>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <Trash2 className="h-3 w-3 text-danger" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-5 w-5 p-0 border-gray-200">
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-gray-600 min-w-[20px] text-center">{item.qty}</span>
                                <Button variant="outline" size="sm" className="h-5 w-5 p-0 border-gray-200">
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <span className="text-gray-600 ml-2">× {item.price.toLocaleString()}</span>
                              </div>
                              <div className="font-semibold text-foreground">{item.total.toLocaleString()} TZS</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Subtotal</span>
                      <span>{subtotal.toLocaleString()} TZS</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Tax (18%)</span>
                      <span>{tax.toLocaleString()} TZS</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{total.toLocaleString()} TZS</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full h-9 text-xs mt-2">Complete Sale</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xs font-semibold">Payment Method</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-12 text-xs border-gray-200">
                              <Banknote className="h-4 w-4 mr-2" />
                              Cash
                            </Button>
                            <Button variant="outline" className="h-12 text-xs border-gray-200">
                              <Smartphone className="h-4 w-4 mr-2" />
                              M-Pesa
                            </Button>
                            <Button variant="outline" className="h-12 text-xs border-gray-200">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Card
                            </Button>
                            <Button variant="outline" className="h-12 text-xs border-gray-200">
                              <Banknote className="h-4 w-4 mr-2" />
                              Bank Transfer
                            </Button>
                          </div>
                          <div>
                            <Label htmlFor="amount" className="text-xs text-gray-600">Amount Received</Label>
                            <Input id="amount" placeholder="0" className="h-8 text-xs border-gray-200" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" className="h-8 text-xs border-gray-200">Cancel</Button>
                            <Button className="h-8 text-xs">Process Payment</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full h-9 text-xs border-gray-200">Clear Cart</Button>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
