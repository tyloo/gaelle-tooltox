"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, X } from "lucide-react";
import {
  format,
  eachDayOfInterval,
  eachYearOfInterval,
  isSunday,
  isWithinInterval,
} from "date-fns";
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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
});

const publicHolidays = (start: Date, end: Date) => {
  const publicHolidays = [] as Date[];

  const years = eachYearOfInterval({ start, end });

  years.forEach(async (year) => {
    const yearHolidays = await fetch(
      `https://calendrier.api.gouv.fr/jours-feries/metropole/${year.getFullYear()}.json`
    )
      .then((res) => res.json())
      .then((data) => Object.keys(data));
    yearHolidays.forEach((holiday) => {
      publicHolidays.push(new Date(holiday));
    });
  });

  return publicHolidays;
};

function countBillableDays(start: Date, end: Date) {
  const daysInterval = eachDayOfInterval({ start, end });
  const sundays = daysInterval.filter((day) => isSunday(day)).length;
  const holidays = publicHolidays(start, end).filter((holiday) =>
    isWithinInterval(holiday, { start, end })
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
    <Card className="w-full max-w-md mx-auto my-auto">
      <CardHeader>
        <CardTitle>Calcul de jours</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
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
                    <span className="sr-only">Recommencer</span>
                  </Button>
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
      </CardContent>
    </Card>
  );
}
