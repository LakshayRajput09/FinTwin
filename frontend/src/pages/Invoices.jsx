import { useState } from "react";
import Papa from "papaparse";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  Database,
  RefreshCw,
} from "lucide-react";

import ModulePage from "../components/ModulePage";
import {
  replaceInvoices,
} from "../data/financialStore";

function Invoices() {
  const [invoices, setInvoices] = useState([]);

  const [errors, setErrors] = useState([]);

  const [importedFile, setImportedFile] = useState("");

  const [notification, setNotification] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  /* =========================================
     FORMAT MONEY
  ========================================= */

  const formatMoney = (amount) => {
    const number = Number(amount);

    if (Number.isNaN(number)) {
      return "₹0";
    }

    return `₹${(number / 100000).toFixed(2)} L`;
  };

  /* =========================================
     DATE VALIDATION
  ========================================= */

  const isValidDate = (date) => {
    if (!date) return false;

    const parsed = new Date(date);

    return !Number.isNaN(parsed.getTime());
  };

  /* =========================================
     CSV VALIDATION
  ========================================= */

  const validateInvoice = (invoice, index) => {
    const problems = [];

    const invoiceNumber =
      invoice.invoice_number?.trim();

    const customer =
      invoice.customer?.trim();

    const amount =
      Number(invoice.amount);

    const invoiceDate =
      invoice.invoice_date?.trim();

    const dueDate =
      invoice.due_date?.trim();

    const status =
      invoice.status?.trim();

    const paymentDate =
      invoice.payment_date?.trim();


    /* Invoice number */

    if (!invoiceNumber) {
      problems.push({
        type: "Missing Invoice Number",
        message: "Invoice number is missing.",
        value: "Empty",
      });
    }


    /* Customer */

    if (!customer) {
      problems.push({
        type: "Missing Customer",
        message: "Customer name is missing.",
        value: "Empty",
      });
    }


    /* Amount */

    if (!invoice.amount) {
      problems.push({
        type: "Missing Amount",
        message: "Invoice amount is missing.",
        value: "Empty",
      });
    } else if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      problems.push({
        type: "Invalid Amount",
        message:
          "Invoice amount must be greater than zero.",
        value: invoice.amount,
      });
    }


    /* Invoice date */

    if (!isValidDate(invoiceDate)) {
      problems.push({
        type: "Invalid Invoice Date",
        message:
          "Invoice date is missing or invalid.",
        value: invoiceDate || "Empty",
      });
    }


    /* Due date */

    if (!isValidDate(dueDate)) {
      problems.push({
        type: "Invalid Due Date",
        message:
          "Due date is missing or invalid.",
        value: dueDate || "Empty",
      });
    }


    /* Due date before invoice date */

    if (
      isValidDate(invoiceDate) &&
      isValidDate(dueDate)
    ) {
      const invoiceTime =
        new Date(invoiceDate).getTime();

      const dueTime =
        new Date(dueDate).getTime();

      if (dueTime < invoiceTime) {
        problems.push({
          type: "Invalid Date Sequence",
          message:
            "Due date occurs before the invoice date.",
          value: `${invoiceDate} → ${dueDate}`,
        });
      }
    }


    /* Status */

    const validStatuses = [
      "Paid",
      "Pending",
      "Overdue",
      "Cancelled",
    ];

    if (
      !validStatuses.includes(status)
    ) {
      problems.push({
        type: "Invalid Status",
        message:
          "Status must be Paid, Pending, Overdue or Cancelled.",
        value: status || "Empty",
      });
    }


    /* Paid invoice without payment date */

    if (
      status === "Paid" &&
      !paymentDate
    ) {
      problems.push({
        type: "Missing Payment Date",
        message:
          "Paid invoices should have a payment date.",
        value: "Empty",
      });
    }


    /* Pending invoice with payment date */

    if (
      status === "Pending" &&
      paymentDate
    ) {
      problems.push({
        type: "Payment Status Conflict",
        message:
          "Pending invoice contains a payment date.",
        value: paymentDate,
      });
    }


    /* Unusually large invoice */

    if (
      !Number.isNaN(amount) &&
      amount > 1000000
    ) {
      problems.push({
        type: "Unusually Large Invoice",
        message:
          "Invoice amount is unusually high compared with the prototype threshold.",
        value: formatMoney(amount),
      });
    }


    return problems.map((problem) => ({
      id: `${index}-${problem.type}`,
      row: index + 2,
      invoice:
        invoiceNumber ||
        `Row ${index + 2}`,
      ...problem,
    }));
  };


  /* =========================================
     FILE UPLOAD
  ========================================= */

  const handleFileUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setIsLoading(true);

    setImportedFile(file.name);

    setErrors([]);

    setNotification("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {

        const rows = results.data;

        if (!rows.length) {
          setNotification(
            "The uploaded CSV does not contain any records."
          );

          setIsLoading(false);

          return;
        }


        /* Required columns */

        const requiredColumns = [
          "invoice_number",
          "customer",
          "amount",
          "invoice_date",
          "due_date",
          "status",
          "payment_date",
        ];

        const headers =
          results.meta.fields || [];

        const missingColumns =
          requiredColumns.filter(
            (column) =>
              !headers.includes(column)
          );


        if (missingColumns.length > 0) {

          const columnErrors =
            missingColumns.map(
              (column, index) => ({
                id: `column-${index}`,
                row: 1,
                invoice: "CSV Header",
                type: "Missing Column",
                message:
                  `Required column "${column}" is missing from the CSV.`,
                value: "Missing",
              })
            );

          setErrors(columnErrors);

          setInvoices([]);

          setNotification(
            "CSV structure needs correction."
          );

          setIsLoading(false);

          return;
        }


        /* Validate rows */

        const validationErrors =
          [];

        rows.forEach(
          (invoice, index) => {

            const problems =
              validateInvoice(
                invoice,
                index
              );

            validationErrors.push(
              ...problems
            );

          }
        );


        /* Store valid-looking records */

        const parsedInvoices =
  rows.map(
    (invoice, index) => ({
      id: invoice.invoice_number ||
        `CSV-${index + 1}`,

      customer:
        invoice.customer,

      amount:
        Number(invoice.amount),

      invoiceDate:
        invoice.invoice_date,

      dueDate:
        invoice.due_date,

      status:
        invoice.status,

      paymentDate:
        invoice.payment_date || null,

      source: "csv",
    })
  );
  replaceInvoices(parsedInvoices);

        setInvoices(
          parsedInvoices
        );

        setErrors(
          validationErrors
        );


        if (
          validationErrors.length === 0
        ) {
          setNotification(
            `Successfully imported ${rows.length} invoices. No data issues detected.`
          );
        } else {
          setNotification(
            `Imported ${rows.length} invoices. ${validationErrors.length} potential data issues detected.`
          );
        }

        setIsLoading(false);
      },

      error: (error) => {
        console.error(error);

        setNotification(
          "Unable to read the CSV file."
        );

        setIsLoading(false);
      },
    });


    /* Reset input so the same file
       can be selected again. */

    event.target.value = "";
  };


  /* =========================================
     REMOVE VALIDATION ISSUE
  ========================================= */

  const handleResolveError = (
    errorId,
    action
  ) => {

    setErrors((previous) =>
      previous.filter(
        (error) =>
          error.id !== errorId
      )
    );

    if (action === "correct") {
      setNotification(
        "Issue marked for correction."
      );
    } else {
      setNotification(
        "Original value retained."
      );
    }
  };


  /* =========================================
     CLEAR IMPORT
  ========================================= */

  const clearImport = () => {
    setInvoices([]);

    setErrors([]);

    setImportedFile("");

    setNotification("");
  };


  /* =========================================
     EXPORT
  ========================================= */

  const exportInvoices = () => {

    if (!invoices.length) {
      setNotification(
        "There are no invoice records to export."
      );

      return;
    }

    const csv =
      Papa.unparse(
        invoices.map(
          (invoice) => ({
            invoice_number:
              invoice.invoice,

            customer:
              invoice.customer,

            amount:
              invoice.amount,

            invoice_date:
              invoice.invoiceDate,

            due_date:
              invoice.dueDate,

            status:
              invoice.status,

            payment_date:
              invoice.paymentDate,
          })
        )
      );

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "fintwin_invoices.csv";

    link.click();

    URL.revokeObjectURL(url);
  };


  /* =========================================
     CALCULATIONS
  ========================================= */

  const outstanding =
    invoices
      .filter(
        (invoice) =>
          invoice.status !== "Paid"
      )
      .reduce(
        (total, invoice) =>
          total +
          (Number(invoice.amount) || 0),
        0
      );


  return (
    <ModulePage
      title="Invoices"
      description="Import, validate and manage business invoices."
      type="invoices"
    >

      {/* =====================================
          NOTIFICATION
      ===================================== */}

      {notification && (
        <div className="invoice-notification">

          <CheckCircle size={18} />

          <span>
            {notification}
          </span>

          <button
            onClick={() =>
              setNotification("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="module-grid">

        <div className="module-stat">
          <span>
            Imported Invoices
          </span>

          <strong>
            {invoices.length}
          </strong>
        </div>


        <div className="module-stat">

          <span>
            Outstanding
          </span>

          <strong>
            {formatMoney(outstanding)}
          </strong>

        </div>


        <div className="module-stat">

          <span>
            Data Issues
          </span>

          <strong
            style={{
              color:
                errors.length
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            {errors.length}
          </strong>

        </div>

      </div>


      {/* =====================================
          IMPORT
      ===================================== */}

      <div className="invoice-import-card">

        <div className="import-icon">
          <Upload size={25} />
        </div>

        <div className="import-content">

          <h2>
            Import Financial Data
          </h2>

          <p>
            Upload a CSV containing invoice
            and payment information.
          </p>

          <label className="upload-button">

            <Upload size={17} />

            {isLoading
              ? "Reading CSV..."
              : "Upload CSV"}

            <input
              type="file"
              accept=".csv"
              onChange={
                handleFileUpload
              }
              hidden
              disabled={isLoading}
            />

          </label>


          {importedFile && (
            <div className="uploaded-file">

              <FileText size={16} />

              <span>
                {importedFile}
              </span>

              <CheckCircle
                size={15}
                color="#16a34a"
              />

              <button
                onClick={clearImport}
                style={{
                  border: "0",
                  background: "transparent",
                  color: "#dc2626",
                  cursor: "pointer",
                }}
                title="Clear import"
              >
                <RefreshCw size={14} />
              </button>

            </div>
          )}

        </div>

      </div>


      {/* =====================================
          VALIDATION
      ===================================== */}

      {errors.length > 0 && (

        <div className="validation-card">

          <div className="validation-header">

            <div className="validation-title">

              <div className="warning-icon">
                <AlertTriangle size={20} />
              </div>

              <div>

                <h2>
                  Data Validation Required
                </h2>

                <p>
                  We found{" "}
                  {errors.length} possible
                  issue
                  {errors.length !== 1
                    ? "s"
                    : ""}{" "}
                  in your imported data.
                </p>

              </div>

            </div>

            <span className="validation-count">
              {errors.length} issues
            </span>

          </div>


          <div className="validation-list">

            {errors.map(
              (error) => (

                <div
                  className="validation-item"
                  key={error.id}
                >

                  <div className="validation-item-icon">
                    <AlertTriangle size={17} />
                  </div>


                  <div className="validation-item-content">

                    <strong>
                      {error.invoice}
                    </strong>

                    <p>
                      <b>
                        {error.type}:
                      </b>{" "}
                      {error.message}
                    </p>

                    <span>
                      Row {error.row} · Imported value:{" "}
                      <b>
                        {error.value}
                      </b>
                    </span>

                  </div>


                  <div className="validation-actions">

                    <button
                      className="correct-button"
                      onClick={() =>
                        handleResolveError(
                          error.id,
                          "correct"
                        )
                      }
                    >
                      Correct
                    </button>

                    <button
                      className="keep-button"
                      onClick={() =>
                        handleResolveError(
                          error.id,
                          "keep"
                        )
                      }
                    >
                      Keep Original
                    </button>

                  </div>

                </div>

              )
            )}

          </div>


          <div className="validation-footer">

            <Database size={16} />

            <span>
              FinTwin does not silently modify
              imported financial data. You decide
              how every issue is handled.
            </span>

          </div>

        </div>
      )}


      {/* =====================================
          INVOICE TABLE
      ===================================== */}

      {invoices.length > 0 && (

        <div className="invoice-table-card">

          <div className="invoice-table-header">

            <div>

              <h2>
                Invoice Records
              </h2>

              <p>
                Records read directly from your
                uploaded CSV
              </p>

            </div>


            <button
              className="export-button"
              onClick={
                exportInvoices
              }
            >

              <Download size={16} />

              Export

            </button>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Invoice
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Invoice Date
                  </th>

                  <th>
                    Due Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {invoices.map(
                  (invoice) => (

                    <tr
                      key={invoice.id}
                    >

                      <td>
                        <strong>
                          {invoice.invoice ||
                            "—"}
                        </strong>
                      </td>

                      <td>
                        {invoice.customer ||
                          "—"}
                      </td>

                      <td>
                        {formatMoney(
                          invoice.amount
                        )}
                      </td>

                      <td>
                        {invoice.invoiceDate ||
                          "—"}
                      </td>

                      <td>
                        {invoice.dueDate ||
                          "—"}
                      </td>

                      <td>

                        <span
                          className={`invoice-status ${
                            invoice.status ===
                            "Paid"
                              ? "paid"
                              : "pending"
                          }`}
                        >
                          {invoice.status ||
                            "Unknown"}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </ModulePage>
  );
}

export default Invoices;