import { useState } from "react";
import { useTranslation } from "react-i18next";

const unitOptions = ["kg", "g", "quintal", "ton", "piece", "bag", "crate", "litre"];

const initialState = {
  name: "",
  cropType: "",
  price: "",
  stock: "",
  unit: ""
};

const copy = {
  en: {
    title: "Add Product",
    subtitle: "Product location is linked to your farmer profile.",
    locationLabel: "Selling from",
    locationFallback: "Complete your district and state in registration to improve marketplace trust.",
    name: "Product name",
    cropType: "Crop type",
    price: "Price (Rs)",
    stock: "Stock quantity",
    unit: "Unit",
    unitPlaceholder: "Select unit",
    save: "Save Product",
    saving: "Saving..."
  },
  hi: {
    title: "उत्पाद जोड़ें",
    subtitle: "उत्पाद की लोकेशन आपके किसान प्रोफाइल से ली जाएगी।",
    locationLabel: "बिक्री स्थान",
    locationFallback: "बेहतर मार्केटप्लेस भरोसे के लिए पंजीकरण में जिला और राज्य पूरा करें।",
    name: "उत्पाद नाम",
    cropType: "फसल प्रकार",
    price: "कीमत (रु)",
    stock: "स्टॉक मात्रा",
    unit: "इकाई",
    unitPlaceholder: "इकाई चुनें",
    save: "उत्पाद सहेजें",
    saving: "सहेजा जा रहा है..."
  },
  od: {
    title: "ପ୍ରଡକ୍ଟ ଯୋଡନ୍ତୁ",
    subtitle: "ପ୍ରଡକ୍ଟ ଲୋକେସନ ଆପଣଙ୍କ କୃଷକ ପ୍ରୋଫାଇଲରୁ ଆସିବ।",
    locationLabel: "ବିକ୍ରୟ ସ୍ଥାନ",
    locationFallback: "ମାର୍କେଟପ୍ଲେସ ଭରସା ବଢିବା ପାଇଁ ରେଜିଷ୍ଟ୍ରେସନରେ ଜିଲ୍ଲା ଏବଂ ରାଜ୍ୟ ପୂରଣ କରନ୍ତୁ।",
    name: "ପ୍ରଡକ୍ଟ ନାମ",
    cropType: "ଫସଲ ପ୍ରକାର",
    price: "ଦର (ରୁ)",
    stock: "ଷ୍ଟକ ପରିମାଣ",
    unit: "ଏକକ",
    unitPlaceholder: "ଏକକ ବାଛନ୍ତୁ",
    save: "ପ୍ରଡକ୍ଟ ସେଭ କରନ୍ତୁ",
    saving: "ସେଭ ହେଉଛି..."
  }
};

export const ProductForm = ({ onSubmit, loading, farmerLocation }) => {
  const [form, setForm] = useState(initialState);
  const { i18n } = useTranslation();
  const text = copy[i18n.language] || copy.en;
  const locationText = [farmerLocation?.district, farmerLocation?.state].filter(Boolean).join(", ");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        });
        setForm(initialState);
      }}
      className="rounded-3xl bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{text.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{text.subtitle}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-medium">{text.locationLabel}</p>
          <p className="mt-1">{locationText || text.locationFallback}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border p-3" placeholder={text.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded-2xl border p-3" placeholder={text.cropType} value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} />
        <input className="rounded-2xl border p-3" placeholder={text.price} type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-2xl border p-3" placeholder={text.stock} type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <select className="rounded-2xl border p-3 text-slate-700 md:col-span-2" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required>
          <option value="" disabled>{text.unitPlaceholder}</option>
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} className="mt-4 rounded-full bg-emerald-600 px-5 py-3 text-white transition hover:-translate-y-0.5 hover:bg-emerald-700">
        {loading ? text.saving : text.save}
      </button>
    </form>
  );
};
