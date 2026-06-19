import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploadProps {
  previewImage?: string | null;
  width: number;
  height: number;
  label: string;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageUpload({
  previewImage,
  width,
  height,
  label,
  setImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewImage) {
      setPreview(previewImage);
    } else {
      setPreview(null);
    }
  }, [previewImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === width && img.height === height) {
        setImage(file);
        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImage(null);
        setPreview(null);
        setError(`Image must be ${width}x${height} pixels.`);
      }
    };
  };

  return (
    <div className="relative flex flex-col items-center space-y-4 border-2 border-dashed border-white bg-pse-gray p-6 rounded-lg w-[300px] h-[300px] text-center overflow-hidden group">
      {preview && (
        <img
          src={preview}
          alt="Uploaded preview"
          className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-75"
        />
      )}
      <label
        className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg ${
          preview ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <UploadCloud className="w-12 h-12 text-pse-green-second" />
        <span className="text-white font-normal mt-2">{label}</span>
        <span className="text-white font-bold">{`${width}x${height}`}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-500 text-sm z-10">{error}</p>}
    </div>
  );
}
