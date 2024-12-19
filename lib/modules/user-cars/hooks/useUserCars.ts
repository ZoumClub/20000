"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchUserCars, updateUserCarStatus } from "../api";
import type { UserCar } from "../types";

export function useUserCars() {
  const [cars, setCars] = useState<UserCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await fetchUserCars();
      
      if (error) throw error;
      if (!data) throw new Error("No data received");
      
      setCars(data);
    } catch (err) {
      console.error("Error fetching user cars:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch cars"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (carId: string, approved: boolean) => {
    try {
      const { error } = await updateUserCarStatus(
        carId, 
        approved ? "approved" : "pending"
      );

      if (error) throw error;
      
      toast.success(`Car ${approved ? "approved" : "unapproved"} successfully`);
      await fetchCars();
      return true;
    } catch (error) {
      console.error("Error updating car status:", error);
      toast.error("Failed to update car status");
      return false;
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    isLoading,
    error,
    refresh: fetchCars,
    toggleApproval
  };
}