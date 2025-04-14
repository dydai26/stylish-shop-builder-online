import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, X, Menu } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      
      // Check if the search term matches any navigation paths
      const matchedLink = navLinks.find(link => 
        link.label.toLowerCase().includes(searchTerm) || 
        link.path.toLowerCase().includes(searchTerm)
      );
      
      if (matchedLink) {
        navigate(matchedLink.path);
      } else {
        // If no direct match, default to shop page (or you could implement a more complex search)
        navigate(`/shop?search=${encodeURIComponent(searchValue)}`);
      }
      
      setSearchValue("");
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      // Focus the input after it appears
      setTimeout(() => {
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  return (
    <>
      <div className="bg-white py-4">
        <div className="container-custom flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/Layer_1.png" alt="ECOVLUU" className="h-10 md:h-12" />
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <Input
                    id="navbar-search-input"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="w-[200px] md:w-[280px] border-brand-orange focus-visible:ring-brand-orange animate-slide-in-right"
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={toggleSearch}
                    className="ml-2 text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={toggleSearch}
                  className="text-gray-700 hover:text-brand-brown transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            
            <Link to="/account" className="text-gray-700 hover:text-brand-brown transition-colors">
              <User size={20} />
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-brand-brown transition-colors relative">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-gray-700 hover:text-brand-brown transition-colors">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-[250px]">
                  <div className="bg-brand-brown text-white h-full flex flex-col">
                    <div className="p-4 flex justify-end">
                      <SheetTrigger asChild>
                        <button className="text-white hover:text-gray-200">
                          <X size={24} />
                        </button>
                      </SheetTrigger>
                    </div>
                    <div className="flex flex-col py-6">
                      {navLinks.map((link) => (
                        <Link 
                          key={link.path}
                          to={link.path} 
                          className="py-3 px-6 hover:bg-brand-brown/80 transition-colors text-center"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="bg-brand-brown text-white hidden md:block">
        <div className="container-custom flex justify-center">
          <ul className="flex">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="block px-6 py-4 hover:bg-brand-brown/80 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
