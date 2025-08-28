import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/services/api';

const UserContext = createContext();

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage and validate token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('greencart_token');
      const savedUser = localStorage.getItem('greencart_user');

      try {
        if (token) {
          const currentUser = await apiService.getCurrentUser();
          setUser({
            ...currentUser,
            name: currentUser.fullName,
            userType: (currentUser.role || '').toLowerCase(),
          });
        } else if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('greencart_token');
        localStorage.removeItem('greencart_user');
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('greencart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('greencart_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      const { user: userData, token } = response;
      
      // Store token
      localStorage.setItem('greencart_token', token);
      
      // Set user with defaults
      const userWithDefaults = {
        ...userData,
        name: userData.fullName,
        userType: (userData.role || '').toLowerCase(),
        loyaltyPoints: userData.loyaltyPoints || 0,
        createdAt: userData.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(userWithDefaults);
      return { success: true, user: userWithDefaults };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const { user: newUser, token } = response;
      
      // Store token
      localStorage.setItem('greencart_token', token);
      
      // Set user with defaults
      const userWithDefaults = {
        ...newUser,
        name: newUser.fullName,
        userType: (newUser.role || '').toLowerCase(),
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(userWithDefaults);
      return { success: true, user: userWithDefaults };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greencart_token');
    localStorage.removeItem('greencart_user');
  };

  const updateUser = async (updates) => {
    if (user) {
      try {
        const updatedUserData = await apiService.updateUser(user.id, updates);
        const updatedUser = { ...user, ...updatedUserData };
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } catch (error) {
        console.error('User update failed:', error);
        throw error;
      }
    }
  };

  const addLoyaltyPoints = async (points) => {
    if (user) {
      try {
        const updatedUser = {
          ...user,
          loyaltyPoints: (user.loyaltyPoints || 0) + points
        };
        await apiService.updateUser(user.id, { loyaltyPoints: updatedUser.loyaltyPoints });
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } catch (error) {
        console.error('Failed to add loyalty points:', error);
        throw error;
      }
    }
  };

  const forgotPassword = async (email) => {
    try {
      await apiService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await apiService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    addLoyaltyPoints,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};