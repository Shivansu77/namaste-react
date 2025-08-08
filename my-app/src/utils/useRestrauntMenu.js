import { useState, useEffect, useCallback } from 'react';
import { SWIGGY_MENU_API } from './constants';

// Helper function to safely extract data from nested objects
const getNestedData = (obj, keys) => {
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const useRestrauntMenu = (resId) => {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractRestaurantInfo = useCallback((data) => {
    if (!data) return {};
    
    // Try different possible paths to find restaurant info
    const cards = Array.isArray(data.cards) ? data.cards : [];
    
    // Find restaurant info in various possible locations
    const findRestaurantInfo = () => {
      // Try to find in the first few cards
      for (const card of cards) {
        const cardData = card?.card?.card;
        if (!cardData) continue;
        
        // Check for restaurant info in different possible locations
        if (cardData.info) {
          return cardData.info;
        }
        
        if (cardData['@type']?.includes('restaurant')) {
          return cardData;
        }
        
        if (cardData.gridElements?.infoWithStyle?.restaurants?.[0]?.info) {
          return cardData.gridElements.infoWithStyle.restaurants[0].info;
        }
      }
      
      // If not found in the usual places, try any card with an 'info' property
      for (const card of cards) {
        const info = getNestedData(card, ['card', 'card', 'info']);
        if (info) return info;
      }
      
      return {};
    };
    
    const info = findRestaurantInfo() || {};
    
    return {
      id: info.id || '',
      name: info.name || 'Restaurant',
      cuisines: info.cuisines || [],
      costForTwoMessage: info.costForTwoMessage || info.costForTwo || '',
      avgRating: info.avgRating || 0,
      totalRatingsString: info.totalRatingsString || '0 ratings',
      areaName: info.areaName || info.locality || '',
      city: info.city || '',
      sla: info.sla || {},
      feeDetails: info.feeDetails || {},
      cloudinaryImageId: info.cloudinaryImageId || '',
      veg: info.veg || false,
      aggregatedDiscountInfo: info.aggregatedDiscountInfo || {},
      ...info
    };
  }, []);

  const extractMenuSections = useCallback((data) => {
    if (!data) return [];
    
    const cards = Array.isArray(data.cards) ? data.cards : [];
    const menuSections = [];
    
    // Find menu sections in different possible locations
    for (const card of cards) {
      const cardData = card?.card?.card;
      if (!cardData) continue;
      
      // Check for grouped menu sections (most common format)
      if (cardData.gridElements?.infoWithStyle?.restaurants) {
        const restaurants = cardData.gridElements.infoWithStyle.restaurants;
        for (const restaurant of restaurants) {
          if (restaurant.info) {
            menuSections.push({
              title: restaurant.info.name || 'Menu',
              itemCards: restaurant.info.menu?.items || [],
              categories: restaurant.info.categories || []
            });
          }
        }
      }
      
      // Check for regular menu items
      if (cardData.itemCards?.length > 0) {
        menuSections.push({
          title: cardData.title || 'Menu',
          itemCards: cardData.itemCards,
          categories: cardData.categories || []
        });
      }
      
      // Check for grouped cards (common in menu responses)
      if (cardData.groupedCard?.cardGroupMap?.REGULAR?.cards) {
        const regularCards = cardData.groupedCard.cardGroupMap.REGULAR.cards;
        for (const regularCard of regularCards) {
          const cardInfo = regularCard?.card?.card;
          if (!cardInfo) continue;
          
          // Skip cards without items
          if (!cardInfo.itemCards?.length && !cardInfo.categories?.length) continue;
          
          menuSections.push({
            title: cardInfo.title || 'Menu',
            itemCards: cardInfo.itemCards || [],
            categories: cardInfo.categories || []
          });
        }
      }
      
      // Check for categories
      if (cardData.categories?.length > 0) {
        menuSections.push({
          title: cardData.title || 'Categories',
          categories: cardData.categories,
          itemCards: cardData.itemCards || []
        });
      }
    }
    
    // Process categories to extract items
    const processedSections = [];
    const seenTitles = new Set();
    
    for (const section of menuSections) {
      // Skip empty sections
      if ((!section.itemCards || section.itemCards.length === 0) && 
          (!section.categories || section.categories.length === 0)) {
        continue;
      }
      
      // Skip duplicate sections
      const sectionTitle = section.title || 'Menu';
      if (seenTitles.has(sectionTitle)) continue;
      seenTitles.add(sectionTitle);
      
      // Process categories if present
      if (section.categories?.length > 0) {
        for (const category of section.categories) {
          if (category.itemCards?.length > 0) {
            processedSections.push({
              title: category.title || sectionTitle,
              itemCards: category.itemCards,
              isCategory: true
            });
          }
        }
      }
      
      // Add the main section if it has items
      if (section.itemCards?.length > 0) {
        processedSections.push({
          title: sectionTitle,
          itemCards: section.itemCards,
          isCategory: false
        });
      }
    }
    
    return processedSections;
  }, []);

  useEffect(() => {
    if (!resId) {
      setError('No restaurant ID provided');
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add cache-busting parameter to avoid stale data
        const timestamp = new Date().getTime();
        const response = await fetch(`${SWIGGY_MENU_API}${resId}&t=${timestamp}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load menu. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Log the full response for debugging
        console.log('API Response:', data);
        
        // Handle case where response is not JSON or has unexpected format
        if (!data) {
          throw new Error('Invalid response from server');
        }
        
        // Extract restaurant info and menu sections
        const restaurantData = extractRestaurantInfo(data);
        const menuSections = extractMenuSections(data);
        
        if (!menuSections.length) {
          console.warn('No menu sections found in the response');
          console.log('Full API response:', data);
        }
        
        setRestaurantInfo(restaurantData);
        setMenuItems(menuSections);
      } catch (err) {
        console.error('Error fetching restaurant menu:', err);
        setError(err.message || 'Failed to fetch menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [resId, extractRestaurantInfo, extractMenuSections]);

  // Filter menu items by veg/non-veg
  const filterMenuItems = useCallback((isVeg) => {
    if (!menuItems.length) return [];
    
    return menuItems.map(section => {
      const items = section.itemCards || [];
      
      const filteredItems = items.filter(item => {
        // Handle different item structures
        const itemInfo = item.card?.info || item.dishInfo || item.info || item;
        if (!itemInfo) return false;
        
        // Check multiple possible properties for veg/non-veg indicator
        const isItemVeg = 
          itemInfo.isVeg === 1 || 
          itemInfo.vegClassifier === 'VEG' ||
          itemInfo.itemAttribute?.vegClassifier === 'VEG' ||
          itemInfo.itemAttribute?.vegClassifier === 'VEGETARIAN' ||
          itemInfo.is_veg === 1 ||
          itemInfo.is_vegetarian === true;
        
        return isVeg ? isItemVeg : !isItemVeg;
      });
      
      // Return a new section with filtered items
      return {
        ...section,
        itemCards: filteredItems
      };
    }).filter(section => 
      // Remove sections that have no items after filtering
      section.itemCards?.length > 0 ||
      (section.categories?.some(cat => cat.itemCards?.length > 0))
    );
  }, [menuItems]);

  return {
    restaurantInfo,
    menuItems,
    loading,
    error,
    filterMenuItems,
  };
};

export default useRestrauntMenu;