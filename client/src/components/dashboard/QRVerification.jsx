import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api, { errMsg } from "../../api.js";
import Icon from "../Icons.jsx";

export default function QRVerification({ eventId, onScan }) {
  const [cam, setCam] = useState("idle");
  const [scannerActive, setScannerActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [manual, setManual] = useState("");

  const timer = useRef();
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const last = useRef({ code: "", at: 0 });

  const checkIn = async (code) => {
    if (processingRef.current) return;

    const now = Date.now();
    if (last.current.code === code && now - last.current.at < 3000) return;

    processingRef.current = true;
    last.current = { code, at: now };

    try {
      let entry;

      try {
        const { data } = await api.post("/checkin", { code, eventId });
        entry = { ok: true, text: `${data.name} verified`, time: new Date() };
        setToast({
          ok: true,
          title: "Ticket Verified (Valid)",
          sub: `${data.name} · ${data.ticketType}`,
        });
      } catch (e) {
        entry = { ok: false, text: errMsg(e), time: new Date() };
        setToast({ ok: false, title: "Ticket Rejected", sub: errMsg(e) });
      }

      onScan(entry);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 4000);

      const scanner = scannerRef.current;
      if (scanner?.isScanning) await scanner.stop();

      setScannerActive(false);
      setCam("stopped");
    } catch (error) {
      console.error("Check-in error:", error);
    } finally {
      processingRef.current = false;
    }
  };

  const handler = useRef(checkIn);
  handler.current = checkIn;

  useEffect(() => {
    if (!scannerActive) return;

    let cancelled = false;
    let scanner;

    async function startScanner() {
      setCam("starting");

      try {
        scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          (text) => handler.current(text),
          () => {},
        );

        if (cancelled) {
          if (scanner.isScanning) await scanner.stop();
          scanner.clear();
        } else {
          setCam("on");
        }
      } catch (error) {
        console.error("Camera start error:", error);
        if (!cancelled) {
          setCam("error");
          setScannerActive(false);
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      clearTimeout(timer.current);

      if (scanner) {
        const stopScanner = async () => {
          try {
            if (scanner.isScanning) await scanner.stop();
            scanner.clear();
          } catch {
            // Scanner may already be stopped.
          }
        };
        stopScanner();
      }
    };
  }, [eventId, scannerActive]);

  function startScanning() {
    setCam("starting");
    setScannerActive(true);
  }

  return (
    <div className="card">
      <div className="row between">
        <h4 className="ctitle">QR Ticket Verification</h4>
        <span className="muted">
          <Icon name="dots" size={18} />
        </span>
      </div>

      <div className="camera">
        <div id="qr-reader" />

        {cam !== "on" && (
          <div className="cam-placeholder">
            {cam === "idle" && (
              <>
                <span>Camera is off</span>
                <button className="btn small" onClick={startScanning}>
                  Start Scanner
                </button>
              </>
            )}

            {cam === "starting" && <span>Starting camera…</span>}

            {cam === "stopped" && (
              <>
                <span>Ticket processed</span>
                <button className="btn small" onClick={startScanning}>
                  Scan Next Ticket
                </button>
              </>
            )}

            {cam === "error" && (
              <>
                <span>Camera unavailable</span>
                <button className="btn small" onClick={startScanning}>
                  Retry
                </button>
                <small>Use the ticket code box below instead</small>
              </>
            )}
          </div>
        )}

        {cam === "on" && (
          <>
            <div className="frame">
              <i />
              <i />
              <i />
              <i />
              <span className="scanline" />
            </div>
            <p className="hint top">Align QR code within the frame</p>
            <p className="hint bottom">Scan QR code to check in</p>
          </>
        )}

        {toast && (
          <div className={"toast " + (toast.ok ? "ok" : "bad")}>
            <Icon name={toast.ok ? "check" : "dots"} size={18} />
            <div>
              <b>{toast.title}</b>
              <small>{toast.sub}</small>
            </div>
          </div>
        )}
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          if (manual.trim()) checkIn(manual.trim());
          setManual("");
        }}
      >
        <input
          placeholder="Or paste ticket code"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button className="btn small" type="submit">
          Verify
        </button>
      </form>
    </div>
  );
}
