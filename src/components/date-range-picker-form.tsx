"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
});

export default function DateRangePickerForm() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const watchDateRange = form.watch("dateRange");

  function resetDateRange() {
    form.reset({ dateRange: { from: undefined, to: undefined } });
  }

  return (
    <Card className="w-full max-w-md mx-auto my-auto">
      <CardHeader>
        <CardTitle>Calcul de jours</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Plage de dates</FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "dd/MM/yyyy")} -{" "}
                                  {format(field.value.to, "dd/MM/yyyy")}
                                </>
                              ) : (
                                format(field.value.from, "dd/MM/yyyy")
                              )
                            ) : (
                              <span>Choisis une plage de dates...</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                            if (value?.from && value?.to) {
                              setIsCalendarOpen(false);
                            }
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={resetDateRange}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reset date range</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {watchDateRange.from && watchDateRange.to && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Selected Date Range:</h3>
            <p>From: {format(watchDateRange.from, "dd/MM/yyyy")}</p>
            {watchDateRange.to && (
              <p>To: {format(watchDateRange.to, "dd/MM/yyyy")}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
