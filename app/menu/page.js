"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';

export default function MenuPage() {
  const [data, setData] = useState({ categories: [], items: [] });
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [mode, setMode] = useState('collection');
  const [isLoading, setIsLoading] = useState(true);
  const [requestedTime, setRequestedTime] = useState('ASAP');
  const [storeConfig, setStoreConfig] = useState(null);
  const [openingHours, setOpeningHours] = useState(null);

  // Load all initial data in parallel for better performance
  useEffect(() => {
    async function loadInitialData() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      console.log('Loading initial data from:', apiUrl);
      
      try {
        // Load all three APIs in parallel with aggressive caching
        const [storeConfigRes, openingHoursRes, menuRes] = await Promise.all([
          fetch(apiUrl + '/api/store/config', {
            cache: 'force-cache', // 行业标准：强缓存静态数据
            next: { revalidate: 300 } // 5分钟缓存
          }),
          fetch(apiUrl + '/api/store/hours', {
            cache: 'force-cache',
            next: { revalidate: 300 } // 5分钟缓存  
          }),
          fetch(apiUrl + '/api/menu', {
            cache: 'force-cache',
            next: { revalidate: 600 } // 10分钟缓存菜单数据
          })
        ]);
        
        // Handle store config
        if (storeConfigRes.ok) {
          const config = await storeConfigRes.json();
          console.log('Store config loaded:', config);
          setStoreConfig(config);
        } else {
          console.error('Store config API error:', storeConfigRes.status, storeConfigRes.statusText);
          // Fallback to default config
          setStoreConfig({
            collection_lead_time_minutes: 15,
            delivery_lead_time_minutes: 45,
            collection_buffer_before_close_minutes: 15,
            delivery_buffer_before_close_minutes: 15
          });
        }
        
        // Handle opening hours
        if (openingHoursRes.ok) {
          const hours = await openingHoursRes.json();
          console.log('Opening hours loaded:', hours);
          setOpeningHours(hours);
        } else {
          console.error('Opening hours API error:', openingHoursRes.status, openingHoursRes.statusText);
        }
        
        // Handle menu data
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          console.log('Menu data loaded:', menuData);
          setData(menuData);
          if (menuData.categories.length > 0) {
            setActiveCategory(menuData.categories[0].id);
          }
        } else {
          console.error('Menu API error:', menuRes.status, menuRes.statusText);
          const errorText = await menuRes.text();
          console.error('Error response:', errorText);
        }
        
      } catch (e) {
        console.error('Error loading initial data:', e);
        // Set fallback config if everything fails
        setStoreConfig({
          collection_lead_time_minutes: 15,
          delivery_lead_time_minutes: 45,
          collection_buffer_before_close_minutes: 15,
          delivery_buffer_before_close_minutes: 15
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInitialData();
  }, []);

  // Load cart from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart from sessionStorage:', e);
        }
      }

      // Load saved delivery mode
      const savedMode = sessionStorage.getItem('orderMode');
      if (savedMode) {
        setMode(savedMode);
      }

      // Load saved postcode and delivery info
      const savedPostcode = sessionStorage.getItem('postcode');
      const savedDeliveryInfo = sessionStorage.getItem('deliveryInfo');
      const savedRequestedTime = sessionStorage.getItem('requestedTime');
      
      if (savedPostcode) {
        setPostcode(savedPostcode);
      }
      if (savedDeliveryInfo) {
        try {
          setDeliveryInfo(JSON.parse(savedDeliveryInfo));
        } catch (e) {
          console.error('Error loading delivery info from sessionStorage:', e);
        }
      }
      if (savedRequestedTime) {
        setRequestedTime(savedRequestedTime);
      }
    }
  }, []);

  // Save delivery mode to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderMode', mode);
    }
  }, [mode]);

  // Save postcode to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (postcode) {
        sessionStorage.setItem('postcode', postcode);
      } else {
        sessionStorage.removeItem('postcode');
      }
    }
  }, [postcode]);

  // Save delivery info to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (deliveryInfo) {
        sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
      } else {
        sessionStorage.removeItem('deliveryInfo');
      }
    }
  }, [deliveryInfo]);

  // Generate time slots based on current time and store config
  const generateTimeSlots = (mode) => {
    if (!storeConfig || !openingHours) return ['ASAP'];
    
    // Use UK timezone for store operations
    const now = new Date();
    const ukTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}));
    const currentTime = ukTime.getHours() * 60 + ukTime.getMinutes(); // Current time in minutes (UK time)
    
    // Get preparation time based on mode
    const prepTime = mode === 'collection' 
      ? storeConfig.collection_lead_time_minutes 
      : storeConfig.delivery_lead_time_minutes;
    
    const bufferMinutes = mode === 'collection'
      ? storeConfig.collection_buffer_before_close_minutes
      : storeConfig.delivery_buffer_before_close_minutes;
    
    // Use opening hours from API response
    let openingPeriods = [];
    
    if (openingHours.isOpen) {
      // Store is open, use the provided hours
      if (openingHours.hours && Array.isArray(openingHours.hours)) {
        openingPeriods = openingHours.hours.map(period => {
          const [openHour, openMin] = period.open_time.split(':').map(Number);
          const [closeHour, closeMin] = period.close_time.split(':').map(Number);
          
          return {
            start: openHour * 60 + openMin,
            end: closeHour * 60 + closeMin
          };
        });
      }
    } else {
      // Store is closed, but still show time slots for future orders
      // For demonstration, let's show some example slots
      const timeSlots = ['ASAP'];
      
      // Add some demo future time slots
      for (let i = 1; i <= 8; i++) {
        const futureTime = currentTime + (i * 30); // Every 30 minutes
        let hours = Math.floor(futureTime / 60);
        const minutes = futureTime % 60;
        
        // Handle next day
        if (hours >= 24) {
          hours = hours - 24;
        }
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const displayMinutes = minutes.toString().padStart(2, '0');
        const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
        
        timeSlots.push(timeString);
      }
      
      return timeSlots;
    }
    
    const timeSlots = ['ASAP'];
    
    // For each opening period, calculate available time slots
    openingPeriods.forEach(period => {
      // Calculate earliest available time
      let earliestTime;
      if (currentTime < period.start) {
        // Before opening: earliest is opening time + prep time
        earliestTime = period.start + prepTime;
      } else if (currentTime >= period.start && currentTime < period.end) {
        // During opening hours: earliest is current time + prep time
        earliestTime = currentTime + prepTime;
      } else {
        // After closing: skip this period
        return;
      }
      
      // Calculate latest available time (closing time - buffer)
      const latestTime = period.end - bufferMinutes;
      
      // Generate 15-minute interval slots
      const interval = 15;
      let slotTime = Math.ceil(earliestTime / interval) * interval;
      
      while (slotTime <= latestTime) {
        let hours = Math.floor(slotTime / 60);
        const minutes = slotTime % 60;
        
        // Handle midnight (24:00 = 0:00 next day)
        if (hours >= 24) {
          hours = hours - 24;
        }
        
        // Format time display
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const displayMinutes = minutes.toString().padStart(2, '0');
        
        const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
        
        // Avoid duplicates
        if (!timeSlots.includes(timeString)) {
          timeSlots.push(timeString);
        }
        
        slotTime += interval;
      }
    });
    
    return timeSlots;
  };

  // Add CSS styles for the menu layout
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .menu-categories ul { padding-left: 0; margin: 0; }
      .menu-categories li { margin-bottom: 5px; }
      .menu-categories a {
        display: block;
        background: #b58b4d;
        color: #fff;
        padding: 8px 12px;
        border-radius: 3px;
        text-decoration: none;
        font-weight: bold;
      }
      .menu-categories a:hover,
      .menu-categories a:focus {
        background: #a2793f;
        color: #fff;
      }
      .menu-items section { margin-bottom: 30px; }
      .menu-items h3 {
        background: #b58b4d;
        color: #fff;
        padding: 10px;
        border-radius: 3px;
        font-size: 1.25rem;
      }
      .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 5px;
        border-bottom: 1px solid #e5e5e5;
      }
      .menu-item:last-child { border-bottom: none; }
      .menu-item .name-section { flex: 1; }
      .menu-item .name { display: block; }
      .menu-item .description { 
        color: #666; 
        font-size: 0.875rem; 
        margin-top: 0.25rem; 
        line-height: 1.3;
      }
      .menu-item .price { margin-right: 10px; white-space: nowrap; }
      .menu-item button {
        background: #b58b4d;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
      }
      .menu-item button:hover { background: #a2793f; cursor: pointer; }
      .order-panel { 
        background: #f9f8f4; 
        padding: 15px; 
        border: 1px solid #ddd; 
        border-radius: 3px; 
        height: fit-content;
        position: sticky;
        top: 100px;
      }
      .order-panel h4 { 
        background: #b58b4d; 
        color:#fff; 
        padding: 10px; 
        margin-top:0; 
        border-radius:3px; 
        font-size: 1.1rem; 
        margin-bottom: 15px;
      }
      .order-panel .option-row { 
        display: flex; 
        align-items: center; 
        margin-bottom: 10px; 
        padding: 8px 0;
      }
      .order-panel .option-row label { 
        margin-left: 5px; 
        margin-right: 15px; 
        font-weight: normal; 
        font-size: 14px;
      }
      .order-panel select { 
        width: 100%; 
        padding: 8px; 
        margin-bottom: 15px; 
        border: 1px solid #ccc;
        border-radius: 3px;
      }
      .cart-empty { 
        font-style: italic; 
        color: #777; 
        margin-bottom: 10px; 
        text-align: center;
        padding: 20px;
      }
      .cart-items { 
        list-style: none; 
        padding: 0; 
        margin: 0; 
        max-height: 300px;
        overflow-y: auto;
      }
      .cart-items li { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        padding: 8px 0; 
        border-bottom: 1px solid #e5e5e5; 
        font-size: 13px;
      }
      .cart-items li:last-child { border-bottom: none; }
      .cart-item-details {
        flex: 1;
        margin-right: 10px;
      }
      .cart-item-name {
        font-weight: bold;
        margin-bottom: 2px;
      }
      .cart-item-options {
        font-size: 11px;
        color: #666;
        margin-bottom: 5px;
      }
      .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 5px;
      }
      .cart-item-qty {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .cart-item-qty button {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 2px;
        font-size: 12px;
        cursor: pointer;
      }
      .cart-item-qty button:hover {
        background: #f0f0f0;
      }
      .cart-item-qty span {
        font-weight: bold;
        min-width: 20px;
        text-align: center;
      }
      .cart-item-price {
        text-align: right;
        min-width: 60px;
      }
      .cart-item-total {
        font-weight: bold;
        color: #b58b4d;
      }
      .cart-item-remove {
        color: #dc3545;
        font-size: 11px;
        cursor: pointer;
        margin-top: 2px;
      }
      .cart-item-remove:hover {
        text-decoration: underline;
      }
      .cart-summary { 
        margin-top: 15px; 
        font-weight: bold; 
        border-top: 2px solid #ddd;
        padding-top: 10px;
      }
      .cart-summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .cart-summary-total {
        font-size: 16px;
        font-weight: bold;
        color: #b58b4d;
        border-top: 1px solid #ddd;
        padding-top: 5px;
        margin-top: 5px;
      }
      .order-panel .checkout-btn { 
        width: 100%; 
        background: #b58b4d; 
        color: #fff; 
        padding: 12px; 
        border: none; 
        border-radius: 3px; 
        font-size: 16px;
        font-weight: bold;
        margin-top: 15px;
      }
      .order-panel .checkout-btn:hover { 
        background: #a2793f; 
        cursor:pointer; 
      }
      .delivery-section {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 3px;
        padding: 10px;
        margin-bottom: 15px;
      }
      .delivery-section input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-bottom: 8px;
        box-sizing: border-box;
      }
      .delivery-section button {
        width: 100%;
        background: #b58b4d;
        color: #fff;
        border: none;
        padding: 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
      }
      .delivery-section button:hover {
        background: #a2793f;
      }
      .delivery-status { 
        font-size: 12px; 
        margin-top: 5px; 
        padding: 5px;
        border-radius: 3px;
      }
      .delivery-status.success { 
        color: #155724; 
        background: #d4edda;
        border: 1px solid #c3e6cb;
      }
      .delivery-status.error { 
        color: #721c24; 
        background: #f8d7da;
        border: 1px solid #f5c6cb;
      }
      .row { display: flex; flex-wrap: wrap; }
      .col-md-3 { flex: 0 0 27.5%; max-width: 27.5%; padding: 0 15px; }
      .col-md-6 { flex: 0 0 45%; max-width: 45%; padding: 0 15px; }
      @media (max-width: 768px) {
        .col-md-3, .col-md-6 { flex: 0 0 100%; max-width: 100%; }
        .order-panel { position: static; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Note: Menu loading is now handled in the parallel loadInitialData function above

  // Update time slots when mode changes or store config loads
  useEffect(() => {
    if (storeConfig) {
      const timeSlots = generateTimeSlots(mode);
      if (!timeSlots.includes(requestedTime)) {
        setRequestedTime(timeSlots[0]);
      }
    }
  }, [mode, storeConfig]);

  function openOptionsModal(item) {
    setSelectedItem(item);
    setSelectedOptions({});
    setShowOptionsModal(true);
  }

  function closeOptionsModal() {
    setShowOptionsModal(false);
    setSelectedItem(null);
    setSelectedOptions({});
  }

  function handleOptionChange(optionId, choiceId, type) {
    if (type === 'radio') {
      setSelectedOptions(prev => {
        const newOptions = {
          ...prev,
          [optionId]: choiceId
        };
        
        // Clear dependent options when parent selection changes
        if (selectedItem?.conditionalOptions && selectedItem.conditionalOptions[optionId]) {
          // Find all dependent options that are no longer valid
          selectedItem.options.forEach(option => {
            if (option.dependsOnOption === optionId && option.dependsOnChoice !== choiceId) {
              // Clear this dependent option's selections
              delete newOptions[option.id];
            }
          });
        }
        
        return newOptions;
      });
    } else if (type === 'checkbox') {
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: prev[optionId] ? 
          prev[optionId].includes(choiceId) ? 
            prev[optionId].filter(id => id !== choiceId) : 
            [...prev[optionId], choiceId] : 
          [choiceId]
      }));
    }
  }

  // Check if an option should be displayed based on conditional logic
  function shouldShowOption(option, selectedItem, selectedOptions) {
    if (!option.isConditional) return true;
    
    // Check if the parent choice is selected
    const parentOption = option.dependsOnOption;
    const parentChoice = option.dependsOnChoice;
    
    if (!parentOption || !parentChoice) return true;
    
    // For radio type parent, check if the specific choice is selected
    const selectedParentChoice = selectedOptions[parentOption];
    return selectedParentChoice === parentChoice;
  }

  function addItemWithOptions() {
    if (!selectedItem) return;

    // Validate required options (only check visible options)
    const visibleOptions = selectedItem.options.filter(opt => shouldShowOption(opt, selectedItem, selectedOptions));
    const requiredOptions = visibleOptions.filter(opt => opt.required);
    const missingRequired = requiredOptions.some(opt => {
      if (opt.type === 'radio') {
        return !selectedOptions[opt.id];
      } else if (opt.type === 'checkbox') {
        return !selectedOptions[opt.id] || selectedOptions[opt.id].length === 0;
      }
      return false;
    });
    
    if (missingRequired) {
      alert('Please select all required options');
      return;
    }

    // Calculate total price including options (only visible options)
    let totalPrice = selectedItem.price;
    let optionDetails = [];

    visibleOptions.forEach(option => {
      if (selectedOptions[option.id]) {
        if (option.type === 'radio') {
          const choice = option.choices.find(c => c.id === selectedOptions[option.id]);
          if (choice) {
            totalPrice += choice.priceDelta;
            optionDetails.push(`${option.name}: ${choice.name}`);
          }
        } else if (option.type === 'checkbox') {
          const selectedChoices = option.choices.filter(c => 
            selectedOptions[option.id].includes(c.id)
          );
          selectedChoices.forEach(choice => {
            totalPrice += choice.priceDelta;
            optionDetails.push(`${option.name}: ${choice.name}`);
          });
        }
      }
    });

    // Create cart item with options
    const cartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: totalPrice,
      basePrice: selectedItem.price,
      qty: 1,
      options: optionDetails,
      selectedOptions: selectedOptions
    };

    // Add to cart
    const existingIdx = cartItems.findIndex((it) => 
      it.id === cartItem.id && 
      JSON.stringify(it.selectedOptions) === JSON.stringify(cartItem.selectedOptions)
    );

    let newItems;
    if (existingIdx >= 0) {
      newItems = cartItems.slice();
      newItems[existingIdx] = {
        ...newItems[existingIdx],
        qty: newItems[existingIdx].qty + 1,
      };
    } else {
      newItems = [...cartItems, cartItem];
    }
    
    setCartItems(newItems);
    
    // Persist to sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }

    closeOptionsModal();
  }

  async function checkDelivery() {
    if (!postcode) {
      alert('Please enter postcode');
      return;
    }

    try {
      const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      const res = await fetch(apiUrl + '/api/delivery/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'delivery', postcode, subtotalPence: subtotal }),
      });
      const data = await res.json();
      setDeliveryInfo(data);
    } catch (e) {
      console.error(e);
      setDeliveryInfo({
        isDeliverable: false,
        reason: 'Error checking delivery availability. Please try again.'
      });
    }
  }

  function removeItem(index) {
    const newItems = cartItems.slice();
    newItems.splice(index, 1);
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  function updateQuantity(index, newQty) {
    if (newQty <= 0) {
      removeItem(index);
      return;
    }
    const newItems = cartItems.slice();
    newItems[index] = { ...newItems[index], qty: newQty };
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const deliveryFee = deliveryInfo?.feePence ? deliveryInfo.feePence / 100 : 0;
  const total = subtotal / 100 + deliveryFee;

  // Generate time slots for current mode
  const timeSlots = generateTimeSlots(mode);

  if (isLoading || !storeConfig) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Placeholder */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto py-4 px-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
        </div>
        
        <div className="container mx-auto py-8">
          <div className="row flex">
            {/* Left Sidebar Skeleton */}
            <div className="col-md-3">
              <div className="space-y-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-12 bg-red-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Center Content Skeleton */}
            <div className="col-md-6">
              <div className="h-12 bg-red-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white rounded border">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mr-4"></div>
                    <div className="h-8 w-8 bg-red-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Sidebar Skeleton */}
            <div className="col-md-3">
              <div className="bg-gray-50 p-4 rounded border">
                <div className="h-8 bg-red-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="mt-6">
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🛒</div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse mt-4"></div>
              </div>
            </div>
          </div>
          
          {/* Loading Message */}
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading delicious menu... Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Layout - Three Columns */}
      <div className="container mx-auto py-8">
        <div className="row flex">
          {/* Left Sidebar - Categories */}
          <div className="col-md-3">
            <nav className="menu-categories">
              <ul className="list-unstyled">
                {data.categories.map((cat) => (
                  <li key={cat.id}>
                    <a 
                      href={`#cat-${cat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveCategory(cat.id);
                      }}
                      className={`block bg-red-600 text-white p-3 rounded mb-2 text-decoration-none font-weight-bold transition-colors ${
                        activeCategory === cat.id ? 'bg-red-700' : 'hover:bg-red-700'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Center - Menu Items */}
          <div className="col-md-6">
            <div className="menu-items">
              {activeCategory && (
                <section id={`cat-${activeCategory}`}>
                  <h3 className="bg-red-600 text-white p-3 rounded text-xl font-bold mb-4">
                    {data.categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  {data.items
                    .filter((i) => i.categoryId === activeCategory)
                    .map((item) => (
                      <div key={item.id} className="menu-item">
                        <div className="name-section">
                          <span className="name text-lg font-semibold">{item.name}</span>
                          {item.description && (
                            <div className="description text-sm text-gray-600 mt-1">{item.description}</div>
                          )}
                        </div>
                        <span className="price text-xl font-bold text-red-600">
                          £{(item.price / 100).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => openOptionsModal(item)}
                          className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 rounded font-semibold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ))}
                </section>
              )}
            </div>
          </div>

          {/* Right Sidebar - Order Panel */}
          <div className="col-md-3">
            <aside className="order-panel">
              <h4>Your Order</h4>
              {/* Opening Hours Display */}
              {openingHours && (
                <div className="opening-hours-display text-center mb-3 p-2 bg-gray-100 rounded text-xs">
                  <div className="font-medium text-gray-700">Opening Hours:</div>
                  <div className="text-gray-600 text-xs">
                    {openingHours.hours && Array.isArray(openingHours.hours) && openingHours.hours.length > 0 ? 
                      openingHours.hours.map(h => h.formatted).join(', ') : 
                      'Closed today'}
                  </div>
                </div>
              )}
              
              {/* Delivery/Collection Mode */}
              <div className="option-row">
                <input 
                  type="radio" 
                  id="del" 
                  name="order-type" 
                  checked={mode === 'delivery'}
                  onChange={() => setMode('delivery')}
                />
                <label htmlFor="del">Home Delivery</label>
              </div>
              <div className="option-row">
                <input 
                  type="radio" 
                  id="col" 
                  name="order-type" 
                  checked={mode === 'collection'}
                  onChange={() => setMode('collection')}
                />
                <label htmlFor="col">Collection</label>
              </div>

              {/* Requested Time */}
              <label htmlFor="req-time">Requested Time</label>
              <select 
                id="req-time" 
                value={requestedTime}
                onChange={(e) => {
                  setRequestedTime(e.target.value);
                  // Save to sessionStorage
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('requestedTime', e.target.value);
                  }
                }}
              >
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>

              {/* Delivery Postcode Check */}
              {mode === 'delivery' && (
                <div className="delivery-section">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Enter postcode"
                  />
                  <button onClick={checkDelivery}>
                    Check
                  </button>
                  {deliveryInfo && (
                    <div className={`delivery-status ${deliveryInfo.isDeliverable ? 'success' : 'error'}`}>
                      {deliveryInfo.isDeliverable
                        ? `Delivery fee £${(deliveryInfo.feePence / 100).toFixed(2)}, minimum order £${(deliveryInfo.minOrderPence / 100).toFixed(2)}`
                        : deliveryInfo.reason}
                    </div>
                  )}
                </div>
              )}

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="text-4xl mb-2">🛒</div>
                  <p>Your shopping cart is empty!</p>
                </div>
              ) : (
                <ul className="cart-items">
                  {cartItems.map((item, idx) => (
                    <li key={idx}>
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        {item.options && item.options.length > 0 && (
                          <div className="cart-item-options">
                            {item.options.map((option, optIdx) => (
                              <div key={optIdx}>{option}</div>
                            ))}
                          </div>
                        )}
                        <div className="cart-item-controls">
                          <div className="cart-item-qty">
                            <button onClick={() => updateQuantity(idx, item.qty - 1)}>-</button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQuantity(idx, item.qty + 1)}>+</button>
                          </div>
                          <div className="cart-item-remove" onClick={() => removeItem(idx)}>
                            Remove
                          </div>
                        </div>
                      </div>
                      <div className="cart-item-price">
                        <div className="cart-item-total">
                          £{((item.price * item.qty) / 100).toFixed(2)}
                        </div>
                        <div>£{(item.price / 100).toFixed(2)} each</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Sub‑Total:</span>
                    <span>£{(subtotal / 100).toFixed(2)}</span>
                  </div>
                  {mode === 'delivery' && deliveryInfo?.isDeliverable && (
                    <div className="cart-summary-row">
                      <span>Delivery:</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="cart-summary-total">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              {mode === 'delivery' && cartItems.length > 0 && (!deliveryInfo || !deliveryInfo.isDeliverable) && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {!postcode ? 
                    'Please enter your postcode and click "Check" to verify delivery availability before checkout.' :
                    (!deliveryInfo ? 
                      'Please click "Check" to verify your postcode for delivery.' :
                      (!deliveryInfo.isDeliverable ? 
                        `Delivery not available: ${deliveryInfo.reason}` :
                        ''
                      )
                    )
                  }
                </div>
              )}
              <button 
                className="checkout-btn"
                disabled={cartItems.length === 0 || (mode === 'delivery' && (!deliveryInfo || !deliveryInfo.isDeliverable))}
                onClick={() => (window.location.href = '/checkout')}
              >
                {cartItems.length === 0 ? 'Cart Empty' : 'Checkout'}
              </button>
            </aside>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                <button 
                  onClick={closeOptionsModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">{selectedItem.description}</p>
              
              <div className="space-y-8">
                {selectedItem.options
                  .filter((option) => shouldShowOption(option, selectedItem, selectedOptions))
                  .map((option) => (
                  <div key={option.id} className="border-b border-gray-200 pb-8">
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      {option.name}
                      {option.required && <span className="text-red-500 ml-3 text-sm bg-red-100 px-2 py-1 rounded">Required</span>}
                    </h4>
                    <div className="space-y-3">
                      {option.choices.map((choice) => (
                        <label key={choice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center">
                            <input
                              type={option.type}
                              name={option.id}
                              value={choice.id}
                              checked={
                                option.type === 'radio' 
                                  ? selectedOptions[option.id] === choice.id
                                  : selectedOptions[option.id]?.includes(choice.id)
                              }
                              onChange={() => handleOptionChange(option.id, choice.id, option.type)}
                              className="mr-4"
                            />
                            <span className="font-semibold text-lg">{choice.name}</span>
                          </div>
                          {choice.priceDelta > 0 && (
                            <span className="text-red-600 font-bold text-lg">
                              +£{(choice.priceDelta / 100).toFixed(2)}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-2xl font-bold">
                  Total: £{((selectedItem.price + 
                    selectedItem.options
                      .filter(opt => shouldShowOption(opt, selectedItem, selectedOptions))
                      .reduce((total, opt) => {
                        if (selectedOptions[opt.id]) {
                          if (opt.type === 'radio') {
                            const choice = opt.choices.find(c => c.id === selectedOptions[opt.id]);
                            return total + (choice?.priceDelta || 0);
                          } else {
                            return total + opt.choices
                              .filter(c => selectedOptions[opt.id]?.includes(c.id))
                              .reduce((sum, c) => sum + c.priceDelta, 0);
                          }
                        }
                        return total;
                      }, 0)) / 100).toFixed(2)}
                </span>
                <button
                  onClick={addItemWithOptions}
                  className="bg-red-600 text-white px-10 py-4 rounded-xl hover:bg-red-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ul className="flex flex-wrap justify-center space-x-6 mb-4">
              <li><Link href="/" className="text-gray-700 hover:text-gray-900">HOME</Link></li>
              <li><Link href="/about" className="text-gray-700 hover:text-gray-900">ABOUT US</Link></li>
              <li><Link href="/terms" className="text-gray-700 hover:text-gray-900">TERMS & CONDITIONS</Link></li>
              <li><Link href="/privacy" className="text-gray-700 hover:text-gray-900">PRIVACY POLICY</Link></li>
              <li><Link href="/cookies" className="text-gray-700 hover:text-gray-900">COOKIE POLICY</Link></li>
              <li><Link href="/disclaimer" className="text-gray-700 hover:text-gray-900">SERVICE DISCLAIMER</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-gray-900">CONTACT US</Link></li>
            </ul>
            <p className="text-gray-600">
              China Palace © 2025. All rights reserved. Designed By China Palace
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}