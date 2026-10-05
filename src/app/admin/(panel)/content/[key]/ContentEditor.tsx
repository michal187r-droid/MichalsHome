"use client";

import { useState, useTransition } from "react";
import { getSection, type Field } from "@/lib/content-schema";
import type { ContentKey } from "@/lib/content";
import { resetContent, saveContent, type ActionState } from "../../../actions";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

export default function ContentEditor({ sectionKey, initial }: { sectionKey: ContentKey; initial: Json }) {
  const section = getSection(sectionKey)!;
  const [value, setValue] = useState<Json>(initial);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionState>(null);
  const [pending, startTransition] = useTransition();

  const update = (next: Json) => {
    setValue(next);
    setDirty(true);
    setResult(null);
  };

  const save = () =>
    startTransition(async () => {
      const r = await saveContent(sectionKey, JSON.stringify(value));
      setResult(r);
      if (r?.ok) setDirty(false);
    });

  const [askReset, setAskReset] = useState(false);
  const reset = () =>
    startTransition(async () => {
      setResult(await resetContent(sectionKey));
      window.location.reload();
    });

  return (
    <div className="editor">
      {section.root.kind === "object" ? (
        <ObjectFields fields={section.root.fields} value={(value as Obj) ?? {}} onChange={update} />
      ) : (
        <ObjectList
          itemLabel={section.root.itemLabel}
          fields={section.root.fields}
          fixed={section.root.fixed}
          titleKey={section.root.titleKey}
          value={(value as Obj[]) ?? []}
          onChange={update}
        />
      )}
      <div className="editor-save">
        {result?.message && <span className={result.ok ? "admin-ok" : "admin-error"}>{result.message}</span>}
        {dirty && !result && <span className="admin-dirty">יש שינויים שלא נשמרו</span>}
        {askReset ? (
          <span className="confirm-row">
            <span>למחוק את כל השינויים בחלק הזה?</span>
            <button type="button" className="admin-btn danger solid" onClick={reset} disabled={pending}>
              כן, להחזיר
            </button>
            <button type="button" className="admin-btn ghost" onClick={() => setAskReset(false)}>
              ביטול
            </button>
          </span>
        ) : (
          <button type="button" className="admin-btn ghost" onClick={() => setAskReset(true)} disabled={pending}>
            החזרה לטקסט המקורי
          </button>
        )}
        <button type="button" className="admin-btn primary" onClick={save} disabled={pending || !dirty}>
          {pending ? "שומרת…" : "שמירה"}
        </button>
      </div>
    </div>
  );
}

function ObjectFields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (key: string, v: Json) => onChange({ ...value, [key]: v });
  return (
    <div className="editor-fields">
      {fields.map((f) => (
        <FieldEditor key={f.key} field={f} value={value[f.key]} onChange={(v) => set(f.key, v)} />
      ))}
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: Field; value: Json | undefined; onChange: (v: Json) => void }) {
  switch (field.kind) {
    case "text":
    case "textarea":
      return (
        <label className="editor-field">
          <span>{field.label}</span>
          {field.kind === "text" ? (
            <input type="text" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <AutoTextarea value={(value as string) ?? ""} onChange={onChange} />
          )}
          {field.hint && <small>{field.hint}</small>}
        </label>
      );
    case "list":
      return (
        <StringList
          label={field.label}
          itemLabel={field.itemLabel}
          multiline={field.multiline}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      );
    case "object":
      return (
        <fieldset className="editor-group">
          <legend>{field.label}</legend>
          <ObjectFields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} />
        </fieldset>
      );
    case "objects":
      return (
        <fieldset className="editor-group">
          <legend>{field.label}</legend>
          <ObjectList
            itemLabel={field.itemLabel}
            fields={field.fields}
            fixed={field.fixed}
            titleKey={field.titleKey}
            value={(value as Obj[]) ?? []}
            onChange={onChange}
          />
        </fieldset>
      );
  }
}

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const rows = Math.min(14, Math.max(2, Math.ceil(value.length / 70) + value.split("\n").length - 1));
  return <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ItemTools({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (to: number) => void; onRemove?: () => void }) {
  return (
    <div className="item-tools">
      <button type="button" disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="העברה למעלה">
        ↑
      </button>
      <button type="button" disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label="העברה למטה">
        ↓
      </button>
      {onRemove && (
        <button type="button" className="remove" onClick={onRemove}>
          מחיקה
        </button>
      )}
    </div>
  );
}

function StringList(props: { label: string; itemLabel: string; multiline?: boolean; value: string[]; onChange: (v: string[]) => void }) {
  const { label, itemLabel, multiline, value, onChange } = props;
  return (
    <fieldset className="editor-group">
      <legend>{label}</legend>
      {value.map((item, i) => (
        <div key={i} className="editor-list-row">
          {multiline ? (
            <AutoTextarea value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          ) : (
            <input type="text" value={item} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          )}
          <ItemTools
            index={i}
            count={value.length}
            onMove={(to) => onChange(move(value, i, to))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button type="button" className="admin-btn ghost add" onClick={() => onChange([...value, ""])}>
        + הוספת {itemLabel}
      </button>
    </fieldset>
  );
}

function ObjectList(props: {
  itemLabel: string;
  fields: Field[];
  fixed?: boolean;
  titleKey?: string;
  value: Obj[];
  onChange: (v: Obj[]) => void;
}) {
  const { itemLabel, fields, fixed, titleKey, value, onChange } = props;
  return (
    <div className="editor-objects">
      {value.map((item, i) => (
        <details key={i} className="editor-object" open={value.length <= 1}>
          <summary>
            {(titleKey && (item[titleKey] as string)) || `${itemLabel} ${i + 1}`}
          </summary>
          {!fixed && (
            <ItemTools
              index={i}
              count={value.length}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          )}
          <ObjectFields fields={fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
        </details>
      ))}
      {!fixed && (
        <button
          type="button"
          className="admin-btn ghost add"
          onClick={() => onChange([...value, Object.fromEntries(fields.map((f) => [f.key, f.kind === "list" || f.kind === "objects" ? [] : ""]))])}
        >
          + הוספת {itemLabel}
        </button>
      )}
    </div>
  );
}
