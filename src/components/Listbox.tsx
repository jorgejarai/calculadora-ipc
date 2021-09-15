import { Listbox as HeadlessListbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface IListValue {
  value: any;
  label: string;
}

interface IProps {
  options: IListValue[];
  selected: any;
  setSelected: (value: any) => void;
  width?: 'large' | 'small';
}

export const Listbox = ({
  options,
  selected,
  setSelected,
  width = 'small',
}: IProps) => {
  const label = options.find((option) => option.value === selected)?.label;
  return (
    <div className={width === 'large' ? 'w-40' : 'w-24'}>
      <HeadlessListbox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <HeadlessListbox.Button className='relative w-full bg-white py-2 pl-3 text-left rounded-lg shadow-md cursor-default text-lg'>
            {label ? (
              <span className='block truncate'>{label}</span>
            ) : (
              <span className='block truncate'>&nbsp;</span>
            )}
          </HeadlessListbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <HeadlessListbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {options.map((option, idx) => (
                <HeadlessListbox.Option
                  key={idx}
                  value={option.value}
                  className={
                    'text-gray-900 cursor-default select-none relative py-2 px-4'
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-bold' : 'font-normal'
                        } block truncate`}
                      >
                        {option.label}
                      </span>
                    </>
                  )}
                </HeadlessListbox.Option>
              ))}
            </HeadlessListbox.Options>
          </Transition>
        </div>
      </HeadlessListbox>
    </div>
  );
};
