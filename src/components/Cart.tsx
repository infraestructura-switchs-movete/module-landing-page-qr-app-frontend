import React, { useCallback, useState } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button, CircularProgress } from "@mui/material";
import { CartItem } from "../types/productsType";
import { useDecryptData } from "../hooks/useDecrypt";
import { BASE_URL_API } from '../constants/index';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const URL: string = `${BASE_URL_API}`;

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("");
  const [popupAction, setPopupAction] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const tokenParam =
    window.location.search || window.location.hash.split("?")[1] || "";
  const phoneToken = new URLSearchParams(tokenParam).get("token") ?? "";
  const mesaToken = new URLSearchParams(tokenParam).get("mesa") ?? "";
  const qrToken = new URLSearchParams(tokenParam).get("qr") ?? "";
  const deliveryToken = new URLSearchParams(tokenParam).get("Delivery") ?? "";

  const {
    decryptedData: phone,
    loading: phoneLoading,
    error: phoneError,
  } = useDecryptData(phoneToken);

  const {
    decryptedData: mesa,
  } = useDecryptData(mesaToken);

  const handleSendOrder = useCallback(async () => {
  setLoading(true);

  if (phoneLoading) {
    setPopupMessage("Procesando información... Por favor espera un momento");
    setPopupButtonText("Aceptar");
    setOpenPopup(true);
    setPopupAction(() => () => {
      setOpenPopup(false);
    });
    setLoading(false);
    return;
  }

  if (phoneError) {
    setPopupMessage("Error al procesar tu información de contacto 🤔");
    setPopupButtonText("Aceptar");
    setOpenPopup(true);
    setPopupAction(() => () => {
      setOpenPopup(false);
    });
    setLoading(false);
    return;
  }

  if (!phone) {
    setPopupMessage("No se encontró tu número de WhatsApp 🤔");
    setPopupButtonText("Aceptar");
    setOpenPopup(true);
    setPopupAction(() => () => {
      setOpenPopup(false);
    });
    setLoading(false);
    return;
  }

  const orderItems = items.map((i) => ({
    productId: i.product.productId.toString(),
    name: i.product.name,
    qty: i.quantity,
    unitPrice: i.product.price,
  }));

  const orderData = {
    phone,
    items: orderItems,
    total,
    restaurantTable: mesa,
  };

  const apiUrl =
    qrToken
      ? `${URL}/order`
      : deliveryToken
      ? `${URL}/order-delivery/saveOrder`
      : null;

  if (!apiUrl) {
    setPopupMessage("No se pudo determinar el tipo de pedido.");
    setPopupButtonText("Aceptar");
    setPopupAction(() => () => {
      setOpenPopup(false);
    });
    setOpenPopup(true);
    setLoading(false);
    return;
  }

  const deliveryData = deliveryToken
    ? {
        ...orderData,
        method: "",
        nameClient: "",
        address: "",
        phoneClient: phone,
        mail: "",
      }
    : orderData;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deliveryData),
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar el pedido");
    }

    const data = await response.json();

    const whatsappNumber = qrToken
      ? "573128362367"
      : deliveryToken
      ? "573180389934" 
      : "573128362367"; 

    setPopupMessage("¡Pedido guardado correctamente!");
    setPopupButtonText("Ir a WhatsApp");
    setPopupAction(() => () => {
      window.open(`https://wa.me/${whatsappNumber}`, "_blank");
      onClearCart();
      setOpenPopup(false);
      onClose();
    });
    setOpenPopup(true);
  } catch (err) {
    console.error(err);
    setPopupMessage("No se pudo guardar el pedido, el mesero va en camino.");
    setPopupButtonText("Aceptar");
    setPopupAction(() => () => {
      setOpenPopup(false);
    });
    setOpenPopup(true);
  } finally {
    setLoading(false);
  }
}, [
  items,
  phone,
  mesa,
  qrToken,
  deliveryToken,
  phoneLoading,
  phoneError,
  total,
  onClearCart,
  onClose,
]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Tu Pedido</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Tu carrito está vacío
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.productId}
                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <p className="text-gray-600 text-xs mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.productId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="text-sm font-medium">{item.quantity}</span>

                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.productId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.product.productId)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded ml-auto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>

              <button
                onClick={onClearCart}
                className="w-full mb-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Eliminar Todo
              </button>

              <button
                onClick={handleSendOrder}
                disabled={phoneLoading || phoneError !== null}
                className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  phoneLoading || phoneError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-slate-700 hover:bg-slate-800"
                } text-white`}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : phoneLoading ? (
                  <span>🔄 Procesando...</span>
                ) : phoneError ? (
                  <span>❌ Error de conexión</span>
                ) : (
                  <span>✓ Enviar Pedido</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      

      {openPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <h3 className="text-lg font-semibold">{popupMessage}</h3>
            <div className="mt-4">
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={popupAction || onClose}
                startIcon={popupButtonText === "Ir a WhatsApp" ? <WhatsAppIcon /> : undefined}
              >
                {popupButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
