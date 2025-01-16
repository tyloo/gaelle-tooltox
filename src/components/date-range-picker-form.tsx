"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, X } from "lucide-react";
import { eachDayOfInterval, format, isSunday } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CopyButton } from "@/components/copy-button";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

const holidays = [
  "2024-01-01",
  "2024-04-01",
  "2024-05-01",
  "2024-05-08",
  "2024-05-09",
  "2024-05-20",
  "2024-07-14",
  "2024-08-15",
  "2024-11-01",
  "2024-11-11",
  "2024-12-25",
  "2025-01-01",
  "2025-04-21",
  "2025-05-01",
  "2025-05-08",
  "2025-05-29",
  "2025-06-09",
  "2025-07-14",
  "2025-08-15",
  "2025-11-01",
  "2025-11-11",
  "2025-12-25",
];

function isPublicHoliday(date: string) {
  return holidays.includes(date);
}

function countBillableDays(start: Date, end: Date) {
  const daysInterval = eachDayOfInterval({ start, end });
  const sundays = daysInterval.filter((day) => isSunday(day)).length;
  const holidays = daysInterval.filter((day) =>
    isPublicHoliday(format(day, "yyyy-MM-dd"))
  ).length;
  const days = daysInterval.length;

  return { days, sundays, holidays };
}

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

  const { days, sundays, holidays } =
    watchDateRange.from && watchDateRange.to
      ? countBillableDays(watchDateRange.from, watchDateRange.to)
      : { days: 0, sundays: 0, holidays: 0 };

  return (
    <div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center gap-2">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                {watchDateRange.from && watchDateRange.to && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={resetDateRange}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Recommencer</span>
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      {watchDateRange.from && watchDateRange.to && (
        <div className="border rounded-md mt-4">
          <Table>
            <TableBody>
              <TableRow key="days">
                <TableCell className="font-bold">Jours</TableCell>
                <TableCell>{days}</TableCell>
                <TableCell className="text-right">
                  <CopyButton value={days} />
                </TableCell>
              </TableRow>
              <TableRow key="sundays">
                <TableCell className="font-bold">Dimanche</TableCell>
                <TableCell>{sundays}</TableCell>
                <TableCell className="text-right">
                  <CopyButton value={sundays} />
                </TableCell>
              </TableRow>
              <TableRow key="holidays">
                <TableCell className="font-bold">Jour férié</TableCell>
                <TableCell>{holidays}</TableCell>
                <TableCell className="text-right">
                  <CopyButton value={holidays} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
