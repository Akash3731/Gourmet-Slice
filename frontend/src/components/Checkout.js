import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import NavigationBar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const Checkout = () => {
  const { cart, resetCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = 5.0;
  const totalPrice = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    if (!user || !user.token) {
      alert("You are not authorized. Please log in again.");
      return;
    }

    if (!address) {
      alert("Please enter your delivery address.");
      return;
    }

    if (paymentMethod === "Credit Card") {
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Please enter your credit card details.");
        return;
      }

      const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
      const cvvPattern = /^\d{3}$/;
      const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;

      if (!cardNumberPattern.test(cardNumber)) {
        alert(
          "Card number must be 16 digits formatted as XXXX XXXX XXXX XXXX."
        );
        return;
      }

      if (!cvvPattern.test(cvv)) {
        alert("CVV must be 3 digits.");
        return;
      }

      if (!expiryDatePattern.test(expiryDate)) {
        alert("Expiry date must be in the format MM/YY.");
        return;
      }
    }

    const orderData = {
      items: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      address,
      paymentMethod,
      total: totalPrice,
      status: paymentMethod === "Credit Card" ? "Paid" : "Pending",
      ...(paymentMethod === "Credit Card" && {
        cardNumber,
        expiryDate,
        cvv,
      }),
    };

    setLoading(true);
    try {
      const response = await fetch(
        "https://gourmet-slice.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.msg || "Failed to place order.");
      }

      alert("Checkout successful!");
      resetCart();
      navigate("/order-success", { state: { order: orderData } });
    } catch (error) {
      console.error("Checkout error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
    if (selectedMethod === "Credit Card") {
      setShowModal(true);
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue.trim());
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      const month = value.substring(0, 2);
      const year = value.substring(2, 4);
      setExpiryDate(`${month}/${year}`);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="bg-gradient-to-r from-blue-50 to-white min-h-screen py-10">
        <div className="container mx-auto mt-5">
          <h2 className="text-center mb-4 text-4xl font-bold text-gray-800">
            Checkout Your Delicious Meal
          </h2>

          <div className="mb-4">
            <h4 className="font-semibold">Delivery Address</h4>
            <input
              type="text"
              className="form-control mt-2 border rounded-md p-3 w-full shadow-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
              required
            />
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Payment Method</h4>
            <div className="relative mt-2">
              <select
                className="form-select border rounded-md p-3 w-full shadow-md appearance-none pr-8"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <option value="Cash on Delivery">
                  <FaMoneyBillWave className="inline-block mr-2" />
                  Cash on Delivery
                </option>
                <option value="Credit Card">
                  <FaCreditCard className="inline-block mr-2" />
                  Credit Card
                </option>
              </select>
            </div>
          </div>

          <div className="text-center mt-4">
            <h4 className="text-lg font-semibold">Your Order Summary</h4>
            <div className="d-flex justify-content-center">
              <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Item</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan="2" className="text-right font-bold">
                      Subtotal:
                    </td>
                    <td className="font-bold">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td colSpan="2" className="text-right font-bold">
                      Delivery Fee:
                    </td>
                    <td className="font-bold">${deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan="2" className="text-right">
                      Total:
                    </td>
                    <td className="text-lg font-bold">
                      ${totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              className="bg-blue-600 text-white rounded-md mt-4 py-2 px-6 hover:bg-blue-700 transition duration-200"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Credit Card Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="font-semibold">Card Number</label>
            <input
              type="text"
              className="form-control mt-2 border rounded-md p-3 shadow-md"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Enter your card number"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">Expiry Date</label>
            <input
              type="text"
              className="form-control mt-2 border rounded-md p-3 shadow-md"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YY"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold">CVV</label>
            <input
              type="text"
              className="form-control mt-2 border rounded-md p-3 shadow-md"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="Enter your CVV"
              required
              autoComplete="off"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Checkout;
