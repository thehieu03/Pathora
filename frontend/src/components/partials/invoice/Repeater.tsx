import React from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useForm, useFieldArray } from "react-hook-form";

const Repeater = () => {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      defaultValues: {
        test: [{ firstName: "Bill", lastName: "Luo", phone: "123456" }],
      },
    },
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });
  const index = 1;
  return (
    <div>
      <div className="-mx-6 bg-slate-50 px-6 py-6 dark:bg-slate-800">
        <div className="mb-6 text-xs font-medium text-slate-600 uppercase dark:text-slate-300">
          Items info-500
        </div>

        <div>
          <form>
            {fields.map((item, index) => (
              <div
                className="mb-5 grid grid-cols-1 gap-5 last:mb-0 md:grid-cols-2 lg:grid-cols-3"
                key={index}
              >
                <Textinput
                  label="First Name"
                  type="text"
                  id={`name${index}`}
                  placeholder="First Name"
                  register={register}
                  name={`test[${index}].firstName`}
                />

                <Textinput
                  label="last Name"
                  type="text"
                  id={`name2${index}`}
                  placeholder="Last Name"
                  register={register}
                  name={`test[${index}].lastName`}
                />

                <div className="flex items-end justify-between space-x-5">
                  <div className="flex-1">
                    <Textinput
                      label="Phone"
                      type="text"
                      id={`name3${index}`}
                      placeholder="Phone"
                      register={register}
                      name={`test[${index}].phone`}
                    />
                  </div>
                  {index > 0 && (
                    <div className="relative flex-none">
                      <button
                        onClick={() => remove(index)}
                        type="button"
                        className="bg-danger-500 border-danger-500 inline-flex h-10 w-10 items-center justify-center rounded-sm border text-lg text-white"
                      >
                        <Icon icon="heroicons-outline:trash" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </form>
          <div className="mt-4">
            <Button
              text="Add new"
              icon="heroicons-outline:plus"
              className="p-0 text-slate-600 dark:text-slate-300"
              onClick={() => append({ firstName: "", lastName: "", phone: "" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repeater;
