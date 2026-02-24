"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Repeater from "./Repeater";
import Flatpickr from "react-flatpickr";

const InvoiceEditPage = () => {
  const [picker, setPicker] = useState(new Date());
  return (
    <div>
      <Card title="Edit Invoice">
        <h4 className="mb-4 text-xl text-slate-900 dark:text-white">
          #89572935Kh
        </h4>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="col-span-1 text-base font-medium text-slate-900 lg:col-span-2 dark:text-slate-300">
              Recipient info-500
            </div>
            <div>
              <label htmlFor="default-picker" className="form-label">
                Issued Date
              </label>

              <Flatpickr
                className="form-control py-2"
                value={picker}
                onChange={([date]) => setPicker(date)}
                id="default-picker"
              />
            </div>

            <Textinput label="Name" type="text" placeholder="Add your name" />
            <Textinput label="Phone" type="text" placeholder="Add your phone" />
            <Textinput
              label="Email"
              type="email"
              placeholder="Add your email"
            />
            <div className="col-span-1 lg:col-span-2">
              <Textarea label="Address" placeholder="address" row={2} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="col-span-1 text-base font-medium text-slate-900 lg:col-span-2 dark:text-slate-300">
              Owner info-500
            </div>

            <Textinput label="Name" type="text" placeholder="Add your name" />
            <Textinput label="Phone" type="text" placeholder="Add your phone" />
            <div className="col-span-1 lg:col-span-2">
              <Textinput
                label="Email"
                type="email"
                placeholder="Add your email"
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <Textarea label="Address" placeholder="address" row={2} />
            </div>
          </div>
        </div>
        <div className="my-6">
          <Repeater />
        </div>
        <Textarea
          label="Additional note"
          row={2}
          placeholder="Note"
          className="lg:w-1/2"
        />
        <div className="space-x-3 ltr:text-right rtl:space-x-reverse rtl:text-left">
          <Button text="Save" className="btn-dark" />
        </div>
      </Card>
    </div>
  );
};

export default InvoiceEditPage;
