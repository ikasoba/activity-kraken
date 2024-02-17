import { $object, $const, $opt, $string, Infer } from "lizod";

export type ApObject = Infer<typeof $ApObject>;
export const $ApObject = $object(
  {
    content: $opt($string),
  },
  false
);

export type AcCreate = Infer<typeof $AcCreate>;
export const $AcCreate = $object(
  {
    type: $const("Create"),
    actor: $opt($string),
    object: $ApObject,
  },
  false
);

export type AcObjectable = Infer<typeof $AcObjectable>;
export const $AcObjectable = $object(
  {
    id: $opt($string),
    actor: $opt($string),
  },
  false
);
