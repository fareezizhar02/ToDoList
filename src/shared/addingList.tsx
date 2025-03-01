"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schema for form validation
const FormSchema = z.object({
  activity: z.string().min(2, "Activity must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  type: z.enum(["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]),
  bookingRequired: z.boolean().default(false),
  accessibility: z.coerce.number().min(0).max(1),
});

export default function AddingList() {
  const [items, setItems] = useState<z.infer<typeof FormSchema>[]>([]);

  // Load saved list from local storage
  useEffect(() => {
    const storedItems = localStorage.getItem("activityList");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save list to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("activityList", JSON.stringify(items));
  }, [items]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      activity: "",
      price: 0,
      type: "education",
      bookingRequired: false,
      accessibility: 0.5,
    },
  });

  // Handle form submission
  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      setItems((prevItems) => [...prevItems, data]);
      form.reset();
    },
    [form]
  );

  // Handle item deletion
  const handleDelete = useCallback(
    (index: number) => {
      setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    },
    []
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-10 mb-10">
      <div className="w-2/3 space-y-6 text-center">
        <h2 className="text-xl font-bold">Total Items: {items.length}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Required</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accessibility ({field.value.toFixed(1)} - 1.0) </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <span>0.0</span>
                      <Slider min={0} max={1} step={0.1} value={[field.value]} onValueChange={(val) => field.onChange(val[0])} />
                      <span>1.0</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add to List</Button>
          </form>
        </Form>

        <div className="space-y-4 w-full">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p><strong>Activity:</strong> {item.activity}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Booking Required:</strong> {item.bookingRequired ? "Yes" : "No"}</p>
                <p><strong>Accessibility:</strong> {item.accessibility}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDelete(index)}>Delete</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
