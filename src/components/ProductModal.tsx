import React, { useState } from "react";
import { ProductType } from "../types/productsType";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ArrowLeft } from "lucide-react";

interface ProductModalProps {
    product: ProductType;
    onClose: () => void;
    onAddToCart: (product: ProductType, quantity: number, comments: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [comments, setComments] = useState("");

    const handleAddToCart = () => {
        onAddToCart(product, quantity, comments);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[95%] relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-2xl text-red-600">
                    <ArrowLeft className="h-6 w-6" />
                </button>

                <div className="flex justify-center mb-8">
                    <img
                        src={product.image}
                        alt={product.productName}
                        className="w-60 h-60 object-cover rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-black">{product.productName}</h2>
                    <p className="text-xl font-bold text-black">{new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                    }).format(product.price)}</p>
                </div>

                <p className="text-sm text-gray-600 mb-8">{product.description || "300g de carne Angus, lechuga, tomate, cebolla, salsa de la casa y tocineta. Acompañado de papas a la francesa."}</p>

                <div className="flex justify-center text-xs text-gray-600 mb-5">
                    <span>Tiempo de preparación: </span>
                    <img src="/assets/icons/sarten.png" alt="Sartén" className="h-4 w-4 mx-1 inline-block" />
                    <span className="font-bold text-sm">30 min. </span>
                    <span className="ml-2">Aprox.</span>
                </div>

                
                <div className="mb-2">
                    <label htmlFor="comments" className="block text-sm font-bold text-black mb-1">
                        Personaliza tu orden
                    </label>

                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="border p-2 w-full mb-3 bg-gray-200 rounded-lg placeholder:text-sm resize-none"
                        rows={3}
                        placeholder="Ejemplo: Sin cebolla, extra salsa"
                    />

                </div>



                <div className="flex items-center mb-3">
                    <div className="flex items-center">
                        <button
                            onClick={() => setQuantity(quantity - 1)}
                            className="p-2 rounded-full bg-red-500 text-white"
                            disabled={quantity <= 1}
                        >
                            <AiOutlineMinus className="h-4 w-4" />
                        </button>

                        <span className="text-lg font-semibold mx-4">{quantity}</span>

                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 rounded-full bg-red-500 text-white mr-2"
                        >
                            <AiOutlinePlus className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-red-600 text-white py-2 px-4 rounded-full w-full"
                    >
                        Agregar
                    </button>
                </div>



            </div>
        </div>
    );
};

export default ProductModal;
