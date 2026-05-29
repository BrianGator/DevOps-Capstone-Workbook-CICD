import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal as TermIcon, 
  Play, 
  Send, 
  Code, 
  Bug, 
  CheckCircle2, 
  RefreshCcw, 
  ShieldCheck, 
  Database,
  FileCode,
  Smartphone,
  Info
} from 'lucide-react';
import { TerminalLog } from '../types';

interface Account {
  id: number;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  status: string;
}

export default function SandboxTab() {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'code-routes' | 'code-tests'>('console');
  const [dbCreated, setDbCreated] = useState(false);
  const [flaskRunning, setFlaskRunning] = useState(false);
  const [talismanSec, setTalismanSec] = useState(true);
  const [corsSec, setCorsSec] = useState(true);
  
  // Local stateful db mock mimicking PostgreSQL customer profiles
  const [database, setDatabase] = useState<Account[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@doe.com",
      address: "123 Main St.",
      phone_number: "555-1212",
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@smith.com",
      address: "456 Oak Ave.",
      phone_number: "555-8888",
      status: "active"
    }
  ]);

  // Terminal commands history logs
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      text: "DevOps Python Sandbox Terminal initialized. Host: 127.0.0.1",
      type: "info",
      timestamp: "21:33:56"
    }
  ]);

  // Command Input
  const [customCommand, setCustomCommand] = useState('');

  // Selected cURL helper
  const [selectedMethod, setSelectedMethod] = useState<'POST' | 'GET_ALL' | 'GET_ONE' | 'PUT' | 'DELETE'>('POST');
  
  // Custom cURL attributes
  const [curlName, setCurlName] = useState('Alice Wonder');
  const [curlEmail, setCurlEmail] = useState('alice@wonder.com');
  const [curlAddress, setCurlAddress] = useState('789 Pine Rd.');
  const [curlPhone, setCurlPhone] = useState('555-9999');
  const [curlTargetId, setCurlTargetId] = useState('1');

  const addLog = (text: string, type: TerminalLog['type']) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { text, type, timestamp: time }]);
  };

  const clearTerminal = () => {
    setLogs([]);
  };

  const handleCreateDb = () => {
    addLog("$ flask db-create", "input");
    addLog("DB-CREATE: Initializing PostgreSQL SQLAlchemy database session...", "info");
    addLog("DB-CREATE: Creating tables for Customer Accounts...", "info");
    addLog("DB-CREATE: Database initialized successfully.", "success");
    setDbCreated(true);
  };

  const handleRunFlask = () => {
    if (!dbCreated) {
      addLog("$ make run", "input");
      addLog("ERROR: Database tables have not been created yet in local environment.", "error");
      addLog("Please execute `flask db-create` first to initialize your workspace database schema.", "info");
      return;
    }
    
    addLog("$ make run", "input");
    addLog("GUNICORN: Starting server on host 0.0.0.0 bound to port 5000", "info");
    addLog("[INFO] Starting gunicorn 20.1.0", "info");
    addLog("[INFO] Listening at: http://0.0.0.0:5000", "success");
    addLog("Service initialized with CORS and Talisman Security Headers", "info");
    setFlaskRunning(true);
  };

  const handleStopFlask = () => {
    addLog("SIGTERM: Stopping Flask microservice application gracefully...", "info");
    setFlaskRunning(false);
  };

  // Run automated Nose Specs animations
  const handleRunTests = () => {
    addLog("$ nosetests -vv --with-spec --spec-color", "input");
    addLog("loading nosetests.cfg configurations...", "info");
    addLog("running Spec unit testing in colorful coverage mode...", "info");
    
    let delay = 0;
    const testSteps = [
      { text: "test_create_account (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_read_account_happy_path (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_read_account_not_found (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_update_account (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_update_account_not_found (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_delete_account (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_list_all_accounts (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_talisman_security_headers_present (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_cors_domain_verification (test_routes.TestAccountRoutes) ... ok", type: "success" },
      { text: "test_method_not_allowed (test_routes.TestAccountRoutes) ... ok", type: "success" },
    ];

    testSteps.forEach((step, idx) => {
      setTimeout(() => {
        addLog(step.text, step.type as any);
      }, (idx + 1) * 200);
    });

    setTimeout(() => {
      addLog("----------------------------------------------------------------------", "info");
      addLog("Name                 Stmts   Miss  Cover   Missing", "info");
      addLog("----------------------------------------------------------------------", "info");
      addLog("service/__init__.py     14      0   100%", "success");
      addLog("service/models.py       82      3    96%", "success");
      addLog("service/routes.py      110      2    98%", "success");
      addLog("----------------------------------------------------------------------", "info");
      addLog("TOTAL                  206      5   97.5%", "success");
      addLog("----------------------------------------------------------------------", "info");
      addLog("Ran 36 tests in 1.45s", "success");
      addLog("OK (97.5% unit tests coverage, spec checks PASS)", "success");
    }, 2400);
  };

  // Perform a simulated cURL request against our local active status DB
  const executeCurl = () => {
    if (!flaskRunning) {
      addLog("CRITICAL ERROR: Terminal target http://127.0.0.1:5000 is offline.", "error");
      addLog("Ensure you click 'Run Flask Server' to boot the service runner first.", "info");
      return;
    }

    const tId = parseInt(curlTargetId) || 1;

    switch (selectedMethod) {
      case 'POST': {
        const payload = {
          name: curlName,
          email: curlEmail,
          address: curlAddress,
          phone_number: curlPhone
        };
        addLog(`$ curl -i -X POST http://127.0.0.1:5000/accounts -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`, "input");
        
        // Push to local mock DB
        const newRecord: Account = {
          id: database.length > 0 ? Math.max(...database.map(d => d.id)) + 1 : 1,
          name: payload.name,
          email: payload.email,
          address: payload.address,
          phone_number: payload.phone_number,
          status: "active"
        };
        setDatabase(prev => [...prev, newRecord]);

        // Output mock headers & body
        addLog("HTTP/1.0 201 CREATED", "success");
        addLog("Content-Type: application/json", "output");
        if (corsSec) addLog("Access-Control-Allow-Origin: *", "output");
        if (talismanSec) {
          addLog("X-Frame-Options: SAMEORIGIN", "output");
          addLog("X-Content-Type-Options: nosniff", "output");
          addLog("Strict-Transport-Security: max-age=31536000 ; includeSubDomains", "output");
        }
        addLog(JSON.stringify(newRecord, null, 2), "output");
        break;
      }

      case 'GET_ALL': {
        addLog("$ curl -i -X GET http://127.0.0.1:5000/accounts", "input");
        addLog("HTTP/1.0 200 OK", "success");
        addLog("Content-Type: application/json", "output");
        if (corsSec) addLog("Access-Control-Allow-Origin: *", "output");
        if (talismanSec) {
          addLog("X-Frame-Options: SAMEORIGIN", "output");
          addLog("X-Content-Type-Options: nosniff", "output");
        }
        addLog(JSON.stringify(database, null, 2), "output");
        break;
      }

      case 'GET_ONE': {
        addLog(`$ curl -i -X GET http://127.0.0.1:5000/accounts/${tId}`, "input");
        const match = database.find(d => d.id === tId);
        if (!match) {
          addLog("HTTP/1.0 404 NOT FOUND", "error");
          addLog("Content-Type: application/json", "output");
          addLog(JSON.stringify({ error: "No customer account exists with reference ID " + tId }, null, 2), "output");
        } else {
          addLog("HTTP/1.0 200 OK", "success");
          addLog("Content-Type: application/json", "output");
          addLog(JSON.stringify(match, null, 2), "output");
        }
        break;
      }

      case 'PUT': {
        const payload = {
          name: curlName,
          email: curlEmail,
          address: curlAddress,
          phone_number: curlPhone
        };
        addLog(`$ curl -i -X PUT http://127.0.0.1:5000/accounts/${tId} -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`, "input");
        
        const index = database.findIndex(d => d.id === tId);
        if (index === -1) {
          addLog("HTTP/1.0 404 NOT FOUND", "error");
          addLog("Content-Type: application/json", "output");
          addLog(JSON.stringify({ error: "Cannot satisfy PUT request: account id " + tId + " not found" }, null, 2), "output");
        } else {
          const updatedRecord = { ...database[index], ...payload };
          const newDb = [...database];
          newDb[index] = updatedRecord;
          setDatabase(newDb);

          addLog("HTTP/1.0 200 OK", "success");
          addLog("Content-Type: application/json", "output");
          addLog(JSON.stringify(updatedRecord, null, 2), "output");
        }
        break;
      }

      case 'DELETE': {
        addLog(`$ curl -i -X DELETE http://127.0.0.1:5000/accounts/${tId}`, "input");
        const match = database.find(d => d.id === tId);
        if (!match) {
          // Deleting missing items is idempotent and reports 204
          addLog("HTTP/1.0 204 NO CONTENT (Idempotent - Target Already Null)", "success");
        } else {
          setDatabase(prev => prev.filter(d => d.id !== tId));
          addLog("HTTP/1.0 204 NO CONTENT", "success");
        }
        break;
      }
    }
  };

  // Preset file code routes payload
  const routesPythonCode = `from flask import jsonify, request, url_for, make_response, abort
from service.models import Account
from service.common import status # HTTP codes
from service import app

#---------------------------------------------------------------------
# CREATE A NEW CUSTOMER ACCOUNT
#---------------------------------------------------------------------
@app.route("/accounts", methods=["POST"])
def create_accounts():
    app.logger.info("Request to create an Account")
    check_content_type("application/json")
    account = Account()
    account.deserialize(request.get_json())
    account.create()
    message = account.serialize()
    
    return make_response(
        jsonify(message), 
        status.HTTP_201_CREATED
    )

#---------------------------------------------------------------------
# READ THE DETAILS OF AN ACCOUNT
#---------------------------------------------------------------------
@app.route("/accounts/<int:account_id>", methods=["GET"])
def get_accounts(account_id):
    app.logger.info("Request to read Account: %s", account_id)
    account = Account.find(account_id)
    if not account:
        abort(
            status.HTTP_404_NOT_FOUND, 
            f"Account with id [{account_id}] could not be found."
        )
    return make_response(
        jsonify(account.serialize()), 
        status.HTTP_200_OK
    )

#---------------------------------------------------------------------
# UPDATE AN EXISTING ACCOUNT
#---------------------------------------------------------------------
@app.route("/accounts/<int:account_id>", methods=["PUT"])
def update_accounts(account_id):
    app.logger.info("Request to update Account: %s", account_id)
    account = Account.find(account_id)
    if not account:
        abort(
            status.HTTP_404_NOT_FOUND, 
            f"Account with id [{account_id}] could not be found."
        )
    account.deserialize(request.get_json())
    account.update()
    return make_response(
        jsonify(account.serialize()), 
        status.HTTP_200_OK
    )

#---------------------------------------------------------------------
# DELETE AN OBSTACLE FROM THE DB
#---------------------------------------------------------------------
@app.route("/accounts/<int:account_id>", methods=["DELETE"])
def delete_accounts(account_id):
    app.logger.info("Request to delete Account with id: %s", account_id)
    account = Account.find(account_id)
    if account:
        account.delete()
    return make_response(
        "", 
        status.HTTP_204_NO_CONTENT
    )

#---------------------------------------------------------------------
# LIST ALL CUSTOMERS IN CATALOG
#---------------------------------------------------------------------
@app.route("/accounts", methods=["GET"])
def list_accounts():
    app.logger.info("Request to inventory active accounts catalog")
    accounts = Account.all()
    results = [account.serialize() for account in accounts]
    return make_response(
        jsonify(results), 
        status.HTTP_200_OK
    )

def check_content_type(media_type):
    """Checks that the media type matches standard JSON specifications"""
    content_type = request.headers.get("Content-Type")
    if content_type and content_type == media_type:
        return
    app.logger.error("Invalid media type reported: %s", content_type)
    abort(
        status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        f"Content-Type must be {media_type}"
    )
`;

  const testsPythonCode = `import os
import unittest
from service import app
from service.models import db, Account, init_db
from service.common import status

DATABASE_URI = os.getenv(
    "DATABASE_URI", 
    "sqlite:///test.db"
)

class TestAccountRoutes(unittest.TestCase):
    """Test suite testing Python Flask customer microservice routes"""

    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True
        app.config["DEBUG"] = False
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
        app.logger.setLevel(60) # Mute output verbose
        init_db(app)

    @classmethod
    def tearDownClass(cls):
        db.session.close()

    def setUp(self):
        db.session.query(Account).delete()
        db.session.commit()
        self.client = app.test_client()

    def test_create_account(self):
        """It should create a new account details in SQLite"""
        payload = {
            "name": "Jane Doe",
            "email": "jane@doe.com",
            "address": "456 Oak Ave.",
            "phone_number": "555-4321"
        }
        res = self.client.post("/accounts", json=payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.get_json()["name"], "Jane Doe")

    def test_read_an_account(self):
        """It should read an account details correctly by matching generated ID"""
        # Create an account
        a = Account(name="John Doe", email="john@doe.com").create()
        res = self.client.get(f"/accounts/{a.id}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.get_json()["email"], "john@doe.com")

    def test_read_account_missing(self):
        """It should trigger a 404 handler when account id is invalid"""
        res = self.client.get("/accounts/0")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_account(self):
        """It should update phone details correctly on existing records"""
        a = Account(name="John Doe", phone_number="555-1212").create()
        payload = {"name": "John Doe", "phone_number": "555-1111"}
        res = self.client.put(f"/accounts/{a.id}", json=payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.get_json()["phone_number"], "555-1111")

    def test_delete_account(self):
        """It should delete accounts records securely"""
        a = Account(name="Pruner").create()
        res = self.client.delete(f"/accounts/{a.id}")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-left" id="sandbox-container">
      {/* Configuration column (IDE & cURL controls) */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
        {/* Flask lifecycle control panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-left" id="lifecycle-panel">
          <div className="flex items-center gap-2 text-blue-600 font-sans text-xs font-bold uppercase">
            <Database className="w-4 h-4 text-emerald-500" />
            FLASK CONTAINER SYSTEM SERVICES
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCreateDb}
              className={`flex items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${
                dbCreated 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-705 border-slate-200'
              }`}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              flask db-create
            </button>

            <button
              onClick={flaskRunning ? handleStopFlask : handleRunFlask}
              className={`flex items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                flaskRunning 
                  ? 'bg-red-50 border-red-200 text-red-650 hover:bg-red-100' 
                  : 'bg-blue-600 hover:bg-blue-710 hover:bg-blue-700 text-white border-blue-600'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {flaskRunning ? "gunicorn stop" : "make run (Port 5000)"}
            </button>
          </div>

          {/* Talisman & CORS switches */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 font-sans">Defense Hardening Filters</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-sans font-medium">
                <input
                  type="checkbox"
                  checked={talismanSec}
                  onChange={(e) => setTalismanSec(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-blue-600 focus:ring-opacity-0 h-4 w-4 cursor-pointer"
                />
                Flask-Talisman Rules
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-sans font-medium">
                <input
                  type="checkbox"
                  checked={corsSec}
                  onChange={(e) => setCorsSec(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-blue-600 focus:ring-opacity-0 h-4 w-4 cursor-pointer"
                />
                Flask-CORS Limit
              </label>
            </div>
          </div>
        </div>

        {/* cURL Client Sandbox Component */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-left" id="curl-sand-client">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-sans text-xs font-bold inline-flex items-center gap-1.5 uppercase">
              <Send className="w-3.5 h-3.5 text-blue-500" />
              REST API CURL SANDBOX
            </span>
            <span className="text-[9px] font-mono font-bold bg-slate-50 text-amber-600 px-2.5 py-0.5 rounded border border-slate-200">
              {flaskRunning ? "● ACTIVE CONTEXT" : "○ SERVICE STANDBY"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {(['POST', 'GET_ALL', 'GET_ONE', 'PUT', 'DELETE'] as const).map(method => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`text-[9px] py-1.5 rounded font-mono font-bold transition-all cursor-pointer ${
                  selectedMethod === method 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {method === 'GET_ALL' ? 'GET ALL' : method === 'GET_ONE' ? 'GET ID' : method}
              </button>
            ))}
          </div>

          {/* Dynamic properties field depending on selected method */}
          <div className="space-y-3 pt-2 text-left">
            {(selectedMethod === 'GET_ONE' || selectedMethod === 'PUT' || selectedMethod === 'DELETE') && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-sans text-slate-400 uppercase">Target Account ID (<span className="text-blue-605 text-blue-600">/accounts/{'{id}'}</span>)</label>
                <input
                  type="number"
                  value={curlTargetId}
                  onChange={(e) => setCurlTargetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 1"
                />
              </div>
            )}

            {(selectedMethod === 'POST' || selectedMethod === 'PUT') && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-sans text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={curlName}
                    onChange={(e) => setCurlName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-705 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-sans text-slate-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={curlEmail}
                    onChange={(e) => setCurlEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-705 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-sans text-slate-400 uppercase">Street Address</label>
                  <input
                    type="text"
                    value={curlAddress}
                    onChange={(e) => setCurlAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-705 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-sans text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={curlPhone}
                    onChange={(e) => setCurlPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-705 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              onClick={executeCurl}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg text-xs font-sans font-bold transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              id="fire-request-btn"
            >
              <Send className="w-3.5 h-3.5" />
              Fire cURL Sandbox Request
            </button>
          </div>
        </div>

        {/* Database records viewer */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs" id="db-catalog-view">
          <h4 className="text-xs font-bold font-sans text-slate-700 uppercase inline-flex items-center gap-1.5 text-left w-full">
            <Database className="w-4 h-4 text-blue-500 animate-pulse" />
            Mock PostgreSQL Database Table
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono text-slate-600 text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-sans uppercase">
                  <th className="pb-2 text-left font-bold">ID</th>
                  <th className="pb-2 text-left font-bold">Name</th>
                  <th className="pb-2 text-left font-bold">Email</th>
                  <th className="pb-2 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {database.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      NO RECORDS FOUND IN WORKSPACE
                    </td>
                  </tr>
                ) : (
                  database.map(acc => (
                    <tr key={acc.id} className="border-b border-slate-150 border-slate-100 hover:bg-slate-50/40">
                      <td className="py-2 font-bold text-slate-800">#{acc.id}</td>
                      <td className="py-2 text-slate-700 font-semibold">{acc.name}</td>
                      <td className="py-2 text-slate-600 truncate max-w-[120px]">{acc.email}</td>
                      <td className="py-2">
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">
                          {acc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Output Console / Code Tabs column */}
      <div className="lg:col-span-12 xl:col-span-7 space-y-4 flex flex-col h-full">
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 justify-between items-center shrink-0 shadow-xs">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveSubTab('console')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-all font-bold cursor-pointer ${
                activeSubTab === 'console' 
                  ? 'bg-slate-100 text-slate-850' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <TermIcon className="w-3.5 h-3.5 text-slate-500" />
              Sandbox Terminal Logs
            </button>
            <button
              onClick={() => setActiveSubTab('code-routes')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-all font-bold cursor-pointer ${
                activeSubTab === 'code-routes' 
                  ? 'bg-slate-100 text-slate-850' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-600" />
              service/routes.py
            </button>
            <button
              onClick={() => setActiveSubTab('code-tests')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-all font-bold cursor-pointer ${
                activeSubTab === 'code-tests' 
                  ? 'bg-slate-100 text-slate-850' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              tests/test_routes.py
            </button>
          </div>

          {activeSubTab === 'console' && (
            <div className="flex gap-1.5">
              <button
                onClick={handleRunTests}
                className="bg-blue-50 text-blue-700 font-mono text-[10px] rounded border border-blue-200 px-2.5 py-1 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                title="Run mock PyUnit tests suite checking 95% threshold"
              >
                Run nosetests
              </button>
              <button
                onClick={clearTerminal}
                className="text-[10px] text-slate-400 hover:text-slate-650 font-mono px-2 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Console / Terminal Body wrapper */}
        <div className="flex-1 bg-slate-950 p-5 rounded-xl border border-slate-200 font-mono text-[11px] h-[550px] overflow-y-auto flex flex-col justify-between" id="sandbox-subtabs-body">
          {activeSubTab === 'console' ? (
            <div className="space-y-2.5 flex-1 text-left" id="terminal-feed-logs">
              {logs.map((log, index) => {
                let colorClass = 'text-slate-400';
                if (log.type === 'input') colorClass = 'text-blue-400 font-bold';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-bold';
                if (log.type === 'error') colorClass = 'text-red-400 font-bold bg-red-950/20 px-1 rounded';
                if (log.type === 'output') colorClass = 'text-slate-350 text-slate-350/90 text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50 whitespace-pre';

                return (
                  <div key={index} className="space-y-0.5 leading-relaxed">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                      <span>[{log.timestamp}]</span>
                      <span className="uppercase text-[8px] tracking-wide font-bold">{log.type === 'input' ? 'CMD' : log.type}</span>
                    </div>
                    <div className={colorClass}>
                      {log.type === 'input' && <span className="text-slate-500 mr-1.5">❯</span>}
                      {log.text}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full text-left overflow-x-auto" id="python-code-viewer-panel">
              <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre p-2 bg-slate-900/40 rounded-lg">
                {activeSubTab === 'code-routes' ? routesPythonCode : testsPythonCode}
              </pre>
            </div>
          )}

          {/* Quick instructions Footer */}
          {activeSubTab === 'console' && (
            <div className="border-t border-slate-800 pt-4 mt-6 text-[10px] text-slate-500 leading-relaxed font-sans shrink-0 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong>Quickstart flow:</strong> click <em>flask db-create</em> to build tables, then click <em>make run</em>. Once the server registers live, send test queries with <strong>Fire cURL</strong> or trigger <strong>nosetests</strong> to assert CORS limits.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
