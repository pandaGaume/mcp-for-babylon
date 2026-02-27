(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["McpServer"] = factory();
	else
		root["McpServer"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/interfaces/index.ts"
/*!*********************************!*\
  !*** ./src/interfaces/index.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mcp_jsonrpc_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mcp.jsonrpc.interfaces */ "./src/interfaces/mcp.jsonrpc.interfaces.ts");
/* harmony import */ var _mcp_core_interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mcp.core.interfaces */ "./src/interfaces/mcp.core.interfaces.ts");
/* harmony import */ var _mcp_behavior_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mcp.behavior.interfaces */ "./src/interfaces/mcp.behavior.interfaces.ts");
/* harmony import */ var _mcp_server_interfaces__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mcp.server.interfaces */ "./src/interfaces/mcp.server.interfaces.ts");






/***/ },

/***/ "./src/interfaces/mcp.behavior.interfaces.ts"
/*!***************************************************!*\
  !*** ./src/interfaces/mcp.behavior.interfaces.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);



/***/ },

/***/ "./src/interfaces/mcp.core.interfaces.ts"
/*!***********************************************!*\
  !*** ./src/interfaces/mcp.core.interfaces.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);



/***/ },

/***/ "./src/interfaces/mcp.jsonrpc.interfaces.ts"
/*!**************************************************!*\
  !*** ./src/interfaces/mcp.jsonrpc.interfaces.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);



/***/ },

/***/ "./src/interfaces/mcp.server.interfaces.ts"
/*!*************************************************!*\
  !*** ./src/interfaces/mcp.server.interfaces.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);



/***/ },

/***/ "./src/server/index.ts"
/*!*****************************!*\
  !*** ./src/server/index.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mcp: () => (/* reexport safe */ _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_2__.Mcp),
/* harmony export */   McpServer: () => (/* reexport safe */ _mcp_server__WEBPACK_IMPORTED_MODULE_0__.McpServer),
/* harmony export */   McpServerBuilder: () => (/* reexport safe */ _mcp_server_builder__WEBPACK_IMPORTED_MODULE_1__.McpServerBuilder),
/* harmony export */   jsonRpcError: () => (/* reexport safe */ _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_2__.jsonRpcError),
/* harmony export */   jsonRpcOk: () => (/* reexport safe */ _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_2__.jsonRpcOk)
/* harmony export */ });
/* harmony import */ var _mcp_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mcp.server */ "./src/server/mcp.server.ts");
/* harmony import */ var _mcp_server_builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mcp.server.builder */ "./src/server/mcp.server.builder.ts");
/* harmony import */ var _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jsonrpc.helpers */ "./src/server/jsonrpc.helpers.ts");





/***/ },

/***/ "./src/server/jsonrpc.helpers.ts"
/*!***************************************!*\
  !*** ./src/server/jsonrpc.helpers.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mcp: () => (/* binding */ Mcp),
/* harmony export */   jsonRpcError: () => (/* binding */ jsonRpcError),
/* harmony export */   jsonRpcOk: () => (/* binding */ jsonRpcOk)
/* harmony export */ });
// ---------------------------------------------------------------------------
// Generic JSON-RPC 2.0 builders
// ---------------------------------------------------------------------------
/**
 * Builds a successful JSON-RPC 2.0 response.
 *
 * @param id     - The request id to echo back.
 * @param result - The result payload. May be any serializable value.
 */
function jsonRpcOk(id, result) {
    return { jsonrpc: "2.0", id, result };
}
/**
 * Builds a JSON-RPC 2.0 error response.
 *
 * @param id      - The request id to echo back, or `null` for parse errors where
 *                  the id could not be determined (cast required by the interface).
 * @param code    - Numeric error code. Standard ranges: -32768 to -32000 are reserved.
 * @param message - Human-readable error description.
 * @param data    - Optional additional diagnostic data.
 */
function jsonRpcError(id, code, message, data) {
    const error = data !== undefined ? { code, message, data } : { code, message };
    // id is null for parse errors per the JSON-RPC 2.0 spec; the interface
    // does not model null here, so a cast is required.
    return { jsonrpc: "2.0", id: id, error };
}
// ---------------------------------------------------------------------------
// MCP-specific helpers
// ---------------------------------------------------------------------------
/**
 * Named helpers for the MCP protocol, built on top of the generic JSON-RPC builders.
 *
 * **Error builders** use standard JSON-RPC / MCP error codes so callers never
 * have to remember magic numbers.
 *
 * **Result builders** encode the exact wire shapes required by the MCP spec so
 * handler code reads as pure domain logic, free of protocol boilerplate.
 *
 * @example
 * ```typescript
 * // Instead of:
 * return { jsonrpc: "2.0", id: req.id, result: { content: [{ type: "text", text: "…" }] } };
 *
 * // Write:
 * return Mcp.toolCallResult(req.id, "…");
 * ```
 */
const Mcp = {
    // ── Errors ───────────────────────────────────────────────────────────────
    /** `-32700` — request body could not be parsed as JSON. `id` is `null` per spec. */
    parseError: () => jsonRpcError(null, -32700, "Parse error"),
    /** `-32601` — the requested method does not exist on this server. */
    methodNotFound: (id, method) => jsonRpcError(id, -32601, `Method not found: ${method}`),
    /** `-32602` — required parameters are missing or malformed. */
    invalidParams: (id, message) => jsonRpcError(id, -32602, message),
    /** `-32603` — an unexpected error occurred while processing the request. */
    internalError: (id, message) => jsonRpcError(id, -32603, message),
    /** `-32002` — no resource matched the given URI. */
    resourceNotFound: (id, uri) => jsonRpcError(id, -32002, `Resource not found: ${uri}`),
    /** `-32002` — no attached behavior instance matched the given URI. */
    instanceNotFound: (id, uri) => jsonRpcError(id, -32002, `Instance not found: ${uri}`),
    /** `-32601` — no tool matched the given name. */
    toolNotFound: (id, name) => jsonRpcError(id, -32601, `Tool not found: ${name}`),
    // ── Results ──────────────────────────────────────────────────────────────
    /** Wraps an `initialize` result. */
    initializeResult: (id, result) => jsonRpcOk(id, result),
    /** Wraps a `resources/list` result. */
    resourcesListResult: (id, resources) => jsonRpcOk(id, { resources }),
    /** Wraps a `resources/templates/list` result. */
    resourcesTemplatesListResult: (id, resourceTemplates) => jsonRpcOk(id, { resourceTemplates }),
    /**
     * Wraps a `resources/read` result.
     * The MCP spec wraps content in an array (`contents`) to allow future multi-part reads.
     */
    resourcesReadResult: (id, content) => jsonRpcOk(id, { contents: [content] }),
    /** Wraps a `tools/list` result. */
    toolsListResult: (id, tools) => jsonRpcOk(id, { tools }),
    /**
     * Wraps a `tools/call` result as a single text content block.
     * Pass a pre-serialized JSON string for structured data.
     */
    toolCallResult: (id, text) => jsonRpcOk(id, { content: [{ type: "text", text }] }),
};


/***/ },

/***/ "./src/server/mcp.server.builder.ts"
/*!******************************************!*\
  !*** ./src/server/mcp.server.builder.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   McpServerBuilder: () => (/* binding */ McpServerBuilder)
/* harmony export */ });
/* harmony import */ var _mcp_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mcp.server */ "./src/server/mcp.server.ts");

/**
 * Fluent builder that constructs a configured {@link McpServer}.
 *
 * @example
 * ```typescript
 * const server = new McpServerBuilder()
 *     .withName("babylon-scene")
 *     .withWsUrl("ws://localhost:8080")
 *     .withInitializer(new SceneInitializer())
 *     .withBehavior(new MeshBehavior(), new LightBehavior())
 *     .withOptions({ idleTimeoutMs: 30_000, reconnect: { baseDelayMs: 1_000, maxDelayMs: 30_000 } })
 *     .build();
 *
 * await server.start();
 * server.attach(heroMesh, meshBehavior);
 * ```
 */
class McpServerBuilder {
    constructor() {
        this._name = "mcp-server";
        this._wsUrl = "";
        this._behaviors = [];
        this._options = {};
    }
    /** Sets the human-readable name reported in `initialize` responses. */
    withName(name) {
        this._name = name;
        return this;
    }
    /** Sets the WebSocket tunnel URL the server will connect to on {@link IMcpServer.start}. */
    withWsUrl(url) {
        this._wsUrl = url;
        return this;
    }
    /**
     * Provides the domain-level initializer that supplies server identity and
     * protocol version during the MCP handshake.
     * If omitted, the server uses built-in defaults.
     */
    withInitializer(initializer) {
        this._initializer = initializer;
        return this;
    }
    /**
     * Registers one or more behavior types.
     * Accepts multiple behaviors in a single call for convenience.
     * Behaviors contribute to the advertised capabilities and enable {@link IMcpServer.attach}.
     */
    withBehavior(...behavior) {
        this._behaviors.push(...behavior);
        return this;
    }
    /**
     * Replaces the default JSON-RPC message routing with a custom handler implementation.
     * When omitted, {@link McpServer} handles routing itself using its built-in logic.
     *
     * Use this to intercept specific MCP methods, add logging, or delegate to a
     * completely different routing strategy.
     */
    withHandlers(handlers) {
        this._handlers = handlers;
        return this;
    }
    /**
     * Merges the given options with any previously set options.
     * Later calls override earlier ones for the same key.
     */
    withOptions(o) {
        this._options = { ...this._options, ...o };
        return this;
    }
    /**
     * Constructs and returns a configured {@link IMcpServer}.
     * @throws {Error} if `withWsUrl()` was not called.
     */
    build() {
        if (!this._wsUrl)
            throw new Error("McpServerBuilder: withWsUrl() is required before build()");
        const server = new _mcp_server__WEBPACK_IMPORTED_MODULE_0__.McpServer(this._name, this._wsUrl, this._options, this._initializer, this._handlers);
        for (const behavior of this._behaviors) {
            server.registerBehavior(behavior);
        }
        return server;
    }
}


/***/ },

/***/ "./src/server/mcp.server.ts"
/*!**********************************!*\
  !*** ./src/server/mcp.server.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   McpServer: () => (/* binding */ McpServer)
/* harmony export */ });
/* harmony import */ var _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jsonrpc.helpers */ "./src/server/jsonrpc.helpers.ts");

/**
 * Default implementation of {@link IMcpServer}.
 *
 * Connects to a WebSocket tunnel and routes incoming JSON-RPC messages to the
 * appropriate MCP handler. Also implements {@link IMcpServerHandlers} so it can
 * act as its own default handler — or delegate to a custom one supplied via the
 * builder's `withHandlers()`.
 *
 * Lifecycle:
 * ```
 * start() → WebSocket opens → receives messages → dispatches to handlers
 * stop()  → WebSocket closes, reconnection cancelled
 * ```
 */
class McpServer {
    constructor(name, wsUrl, options, initializer, handlers) {
        this._ws = null;
        this._isRunning = false;
        /** Set to true by {@link stop} to prevent reconnection after an explicit close. */
        this._stopped = false;
        /**
         * Set to true when the client sends `notifications/initialized`, signalling that
         * the session handshake is complete and the client is ready to issue requests.
         */
        this._sessionReady = false;
        /** Counts consecutive failed reconnection attempts; reset on successful open. */
        this._reconnectAttempts = 0;
        /** Handle for the pending idle-timeout timer, if active. */
        this._idleTimer = null;
        /** Registered behavior types, keyed by namespace. */
        this._behaviors = new Map();
        /** Live object instances, keyed by URI. */
        this._instances = new Map();
        this._name = name;
        this._wsUrl = wsUrl;
        this._options = options;
        this._initializer = initializer;
        // If no custom handlers provided, the server routes messages itself.
        this._handlers = handlers ?? this;
    }
    // -------------------------------------------------------------------------
    // IMcpServer — identity & state
    // -------------------------------------------------------------------------
    get name() {
        return this._name;
    }
    get isRunning() {
        return this._isRunning;
    }
    get isSessionReady() {
        return this._sessionReady;
    }
    // -------------------------------------------------------------------------
    // IMcpServer — lifecycle
    // -------------------------------------------------------------------------
    /**
     * Opens the WebSocket connection to the tunnel URL.
     * Resolves when the connection is established, rejects on the first error.
     * Safe to call again after {@link stop} to reconnect manually.
     */
    start() {
        this._stopped = false;
        this._reconnectAttempts = 0;
        return this._connect();
    }
    /**
     * Closes the WebSocket connection and cancels any pending reconnection.
     * After calling this, no further reconnection attempts will be made until
     * {@link start} is called again.
     */
    async stop() {
        this._stopped = true;
        this._clearIdleTimer();
        this._ws?.close();
        this._ws = null;
        this._isRunning = false;
    }
    // -------------------------------------------------------------------------
    // IMcpServer — behavior & instance management
    // -------------------------------------------------------------------------
    /**
     * Registers a behavior type with the server so that instances of that type
     * can be attached via {@link attach}.
     * Also contributes to the capabilities advertised during `initialize`.
     */
    registerBehavior(behavior) {
        this._behaviors.set(behavior.namespace, behavior);
    }
    /**
     * Wraps `target` with the given behavior and registers the resulting instance
     * as a live MCP resource with callable tools.
     * Safe to call while the server is running; the client will see the new resource
     * on its next `resources/list` or `tools/list` call.
     *
     * @returns The created instance, whose {@link IMcpBehaviorInstance.uri} can be
     *          passed to {@link detach} to remove it later.
     */
    attach(target, behavior) {
        const instance = behavior.attach(target);
        this._instances.set(instance.uri, instance);
        return instance;
    }
    /**
     * Removes a previously attached instance by URI.
     * The resource and its tools disappear from subsequent `resources/list` and
     * `tools/list` responses.
     */
    detach(uri) {
        this._instances.delete(uri);
    }
    // -------------------------------------------------------------------------
    // IMcpServerHandlers — default MCP method implementations
    // -------------------------------------------------------------------------
    /**
     * Handles the `initialize` handshake.
     * Delegates identity/version to {@link IMcpInitializer} if one was provided,
     * then merges with capabilities derived from registered behaviors.
     */
    initialize(req) {
        const params = req.params;
        const identity = this._initializer
            ? this._initializer.initialize(params?.clientInfo ?? { name: "unknown", version: "0.0.0" }, params?.capabilities ?? {})
            : { protocolVersion: "2024-11-05", serverInfo: { name: this._name, version: "0.0.0" } };
        const result = { ...identity, capabilities: this._deriveCapabilities() };
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.initializeResult(req.id, result);
    }
    /**
     * Handles `resources/templates/list`.
     * Collects URI templates from all registered behavior types that declare one.
     * Each unique namespace contributes at most one template entry.
     */
    resourcesTemplatesList(req) {
        const templates = [];
        for (const behavior of this._behaviors.values()) {
            if (behavior.uriTemplate) {
                templates.push({
                    uriTemplate: behavior.uriTemplate,
                    name: behavior.name ?? behavior.namespace,
                    description: behavior.description,
                    mimeType: behavior.mimeType,
                });
            }
        }
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.resourcesTemplatesListResult(req.id, templates);
    }
    /**
     * Handles `resources/list`.
     * Returns the union of all live {@link IMcpBehaviorInstance} resources.
     */
    resourcesList(req) {
        const resources = Array.from(this._instances.values()).map((i) => i.getResource());
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.resourcesListResult(req.id, resources);
    }
    /**
     * Handles `resources/read`.
     * Looks up the instance by URI and returns its current state.
     * Returns a `-32002` error if the URI is not found.
     */
    async resourcesRead(req) {
        const params = req.params;
        const uri = params?.uri;
        if (!uri)
            return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.invalidParams(req.id, "Missing required parameter: uri");
        const instance = this._instances.get(uri);
        if (!instance)
            return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.resourceNotFound(req.id, uri);
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.resourcesReadResult(req.id, await instance.readResource());
    }
    /**
     * Handles `tools/list`.
     * Deduplicates tools by name: all instances of the same behavior expose
     * identical schemas, so each tool is listed only once.
     * The target instance is identified at call time via the `uri` argument.
     */
    toolsList(req) {
        const seen = new Set();
        const tools = [];
        for (const instance of this._instances.values()) {
            for (const tool of instance.getTools()) {
                if (!seen.has(tool.name)) {
                    seen.add(tool.name);
                    tools.push(tool);
                }
            }
        }
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.toolsListResult(req.id, tools);
    }
    /**
     * Handles `tools/call`.
     *
     * Routing strategy (in order):
     * 1. If `arguments.uri` is present, route directly to that instance (fast path).
     *    Behaviors should declare `uri` as a required field in their tool `inputSchema`.
     * 2. Otherwise, scan all instances for the first one that declares the tool (fallback
     *    for single-instance scenarios where a URI is not needed).
     */
    async toolsCall(req) {
        const params = req.params;
        const name = params?.name;
        const args = params?.arguments ?? {};
        if (!name)
            return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.invalidParams(req.id, "Missing required parameter: name");
        // Fast path: route by instance URI when the caller provides it.
        const uri = args["uri"];
        if (uri) {
            const instance = this._instances.get(uri);
            if (!instance)
                return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.instanceNotFound(req.id, uri);
            return this._callTool(req, instance, name, args);
        }
        // Fallback: find the first instance that declares this tool.
        for (const instance of this._instances.values()) {
            if (instance.getTools().some((t) => t.name === name)) {
                return this._callTool(req, instance, name, args);
            }
        }
        return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.toolNotFound(req.id, name);
    }
    // -------------------------------------------------------------------------
    // WebSocket connection management
    // -------------------------------------------------------------------------
    /**
     * Opens a new WebSocket connection and wires up all event handlers.
     * Called by {@link start} and scheduled again by {@link _scheduleReconnect}.
     */
    _connect() {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this._wsUrl);
            ws.onopen = () => {
                this._ws = ws;
                this._isRunning = true;
                this._reconnectAttempts = 0; // reset back-off counter on success
                resolve();
            };
            ws.onerror = () => {
                // Only reject the initial promise; subsequent errors are handled via onclose.
                if (!this._isRunning) {
                    reject(new Error(`McpServer: could not connect to ${this._wsUrl}`));
                }
            };
            ws.onclose = () => this._onDisconnect();
            ws.onmessage = (event) => {
                this._resetIdleTimer();
                void this._handleMessage(event.data);
            };
        });
    }
    /**
     * Called whenever the WebSocket closes (cleanly or not).
     * Triggers reconnection unless {@link stop} was called explicitly.
     */
    _onDisconnect() {
        this._isRunning = false;
        this._ws = null;
        this._sessionReady = false; // handshake must be repeated on reconnection
        this._clearIdleTimer();
        if (!this._stopped) {
            this._scheduleReconnect();
        }
    }
    /**
     * Schedules a reconnection attempt using exponential back-off with jitter.
     *
     * Delay formula: `min(baseDelayMs * 2^attempt, maxDelayMs) * jitter`
     * where `jitter ∈ [0.5, 1.0]` to spread reconnection storms.
     *
     * Gives up silently once `maxAttempts` is reached (if configured).
     */
    _scheduleReconnect() {
        const policy = this._options.reconnect;
        // No reconnect policy means no automatic reconnection.
        if (!policy)
            return;
        const maxAttempts = policy.maxAttempts ?? Infinity;
        if (this._reconnectAttempts >= maxAttempts)
            return;
        const base = policy.baseDelayMs ?? 1_000;
        const max = policy.maxDelayMs ?? 30_000;
        const jitter = 0.5 + Math.random() * 0.5; // [0.5, 1.0]
        const delay = Math.min(base * 2 ** this._reconnectAttempts, max) * jitter;
        this._reconnectAttempts++;
        setTimeout(() => void this._connect(), delay);
    }
    // -------------------------------------------------------------------------
    // Message handling
    // -------------------------------------------------------------------------
    /**
     * Entry point for every raw WebSocket message.
     * Distinguishes JSON-RPC notifications (no `id`) from requests (has `id`):
     * - Notifications are handled but never answered.
     * - Requests are dispatched and produce a response sent back over the socket.
     */
    async _handleMessage(data) {
        let msg;
        try {
            msg = JSON.parse(data);
        }
        catch {
            // Per JSON-RPC 2.0 spec, id is null when the request cannot be parsed.
            this._send(_jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.parseError());
            return;
        }
        // Notifications carry no `id` — handle silently, never respond.
        if (!("id" in msg) || msg.id === null) {
            this._handleNotification(msg);
            return;
        }
        this._send(await this._dispatch(msg));
    }
    /**
     * Handles JSON-RPC notifications sent by the client.
     * Per the MCP spec, no response is ever sent for notifications.
     * Unknown notification methods are silently ignored.
     */
    _handleNotification(notification) {
        switch (notification.method) {
            case "notifications/initialized":
                // Client has finished its own initialisation and is ready to send requests.
                this._sessionReady = true;
                break;
            // All other notifications are intentionally ignored.
        }
    }
    /**
     * Routes a parsed JSON-RPC request to the correct handler method.
     * Unknown methods receive a `-32601 Method not found` error.
     */
    async _dispatch(req) {
        switch (req.method) {
            case "initialize":
                return this._handlers.initialize(req);
            case "resources/list":
                return this._handlers.resourcesList(req);
            case "resources/templates/list":
                return this._handlers.resourcesTemplatesList(req);
            case "resources/read":
                return this._handlers.resourcesRead(req);
            case "tools/list":
                return this._handlers.toolsList(req);
            case "tools/call":
                return this._handlers.toolsCall(req);
            default:
                return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.methodNotFound(req.id, req.method);
        }
    }
    // -------------------------------------------------------------------------
    // Idle timeout
    // -------------------------------------------------------------------------
    /**
     * Resets the idle-timeout timer on each incoming message.
     * When the timer expires the connection is closed, which may trigger reconnection.
     */
    _resetIdleTimer() {
        if (!this._options.idleTimeoutMs)
            return;
        this._clearIdleTimer();
        this._idleTimer = setTimeout(() => {
            this._ws?.close();
        }, this._options.idleTimeoutMs);
    }
    _clearIdleTimer() {
        if (this._idleTimer !== null) {
            clearTimeout(this._idleTimer);
            this._idleTimer = null;
        }
    }
    // -------------------------------------------------------------------------
    // Shared helpers
    // -------------------------------------------------------------------------
    /**
     * Derives server capabilities from registered behavior types.
     * Any registered behavior implies both `resources` and `tools` support.
     */
    _deriveCapabilities() {
        if (this._behaviors.size === 0 && this._instances.size === 0)
            return {};
        return { resources: {}, tools: {} };
    }
    /** Invokes a tool on a specific instance and wraps the result as a JSON-RPC response. */
    async _callTool(req, instance, name, args) {
        try {
            const result = await instance.callTool(name, args);
            return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.toolCallResult(req.id, JSON.stringify(result));
        }
        catch (err) {
            return _jsonrpc_helpers__WEBPACK_IMPORTED_MODULE_0__.Mcp.internalError(req.id, err instanceof Error ? err.message : "Internal error");
        }
    }
    /** Sends a serialized JSON-RPC response over the WebSocket, if open. */
    _send(response) {
        if (this._ws?.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify(response));
        }
    }
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mcp: () => (/* reexport safe */ _server_index__WEBPACK_IMPORTED_MODULE_1__.Mcp),
/* harmony export */   McpServer: () => (/* reexport safe */ _server_index__WEBPACK_IMPORTED_MODULE_1__.McpServer),
/* harmony export */   McpServerBuilder: () => (/* reexport safe */ _server_index__WEBPACK_IMPORTED_MODULE_1__.McpServerBuilder),
/* harmony export */   jsonRpcError: () => (/* reexport safe */ _server_index__WEBPACK_IMPORTED_MODULE_1__.jsonRpcError),
/* harmony export */   jsonRpcOk: () => (/* reexport safe */ _server_index__WEBPACK_IMPORTED_MODULE_1__.jsonRpcOk)
/* harmony export */ });
/* harmony import */ var _interfaces_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interfaces/index */ "./src/interfaces/index.ts");
/* harmony import */ var _server_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server/index */ "./src/server/index.ts");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDNUYsQ0FBQztJQUNMLENBQUM7SUFFRCx3RUFBd0U7SUFDaEUsS0FBSyxDQUFDLFFBQXlCO1FBQ25DLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUssU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0wsQ0FBQztDQUNKOzs7Ozs7O1VDdmREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNObUM7QUFDSiIsInNvdXJjZXMiOlsid2VicGFjazovL01jcFNlcnZlci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTWNwU2VydmVyLy4vc3JjL2ludGVyZmFjZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vTWNwU2VydmVyLy4vc3JjL2ludGVyZmFjZXMvbWNwLmJlaGF2aW9yLmludGVyZmFjZXMudHMiLCJ3ZWJwYWNrOi8vTWNwU2VydmVyLy4vc3JjL2ludGVyZmFjZXMvbWNwLmNvcmUuaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvLi9zcmMvaW50ZXJmYWNlcy9tY3AuanNvbnJwYy5pbnRlcmZhY2VzLnRzIiwid2VicGFjazovL01jcFNlcnZlci8uL3NyYy9pbnRlcmZhY2VzL21jcC5zZXJ2ZXIuaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvLi9zcmMvc2VydmVyL2luZGV4LnRzIiwid2VicGFjazovL01jcFNlcnZlci8uL3NyYy9zZXJ2ZXIvanNvbnJwYy5oZWxwZXJzLnRzIiwid2VicGFjazovL01jcFNlcnZlci8uL3NyYy9zZXJ2ZXIvbWNwLnNlcnZlci5idWlsZGVyLnRzIiwid2VicGFjazovL01jcFNlcnZlci8uL3NyYy9zZXJ2ZXIvbWNwLnNlcnZlci50cyIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTWNwU2VydmVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9NY3BTZXJ2ZXIvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWNwU2VydmVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1jcFNlcnZlclwiXSA9IGZhY3RvcnkoKTtcbn0pKGdsb2JhbFRoaXMsICgpID0+IHtcbnJldHVybiAiLCJleHBvcnQgKiBmcm9tIFwiLi9tY3AuanNvbnJwYy5pbnRlcmZhY2VzXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL21jcC5jb3JlLmludGVyZmFjZXNcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vbWNwLmJlaGF2aW9yLmludGVyZmFjZXNcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vbWNwLnNlcnZlci5pbnRlcmZhY2VzXCI7XHJcbiIsImltcG9ydCB0eXBlIHsgTWNwUmVzb3VyY2UsIE1jcFJlc291cmNlQ29udGVudCwgTWNwVG9vbCB9IGZyb20gXCIuL21jcC5jb3JlLmludGVyZmFjZXNcIjtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc2luZ2xlIG9iamVjdCBpbnN0YW5jZSByZWdpc3RlcmVkIHdpdGggdGhlIE1DUCBzZXJ2ZXIuXG4gKlxuICogQW4gaW5zdGFuY2UgaXMgdGhlIGxpdmUsIHBlci1vYmplY3QgY291bnRlcnBhcnQgb2YgYW4ge0BsaW5rIElNY3BCZWhhdmlvcn0uXG4gKiBJdCBzaW11bHRhbmVvdXNseSBhY3RzIGFzOlxuICogLSBhICoqcmVzb3VyY2UqKiDigJQgdGhlIG9iamVjdCdzIGN1cnJlbnQgc3RhdGUsIHJlYWRhYmxlIHZpYSBgcmVzb3VyY2VzL3JlYWRgXG4gKiAtIGEgKip0b29sIGV4ZWN1dG9yKiog4oCUIG9wZXJhdGlvbnMgdGhlIGNsaWVudCBjYW4gaW52b2tlIG9uIHRoaXMgc3BlY2lmaWMgb2JqZWN0XG4gKlxuICogQ3JlYXRlZCBieSB7QGxpbmsgSU1jcEJlaGF2aW9yLmF0dGFjaH0gYW5kIG1hbmFnZWQgYnkge0BsaW5rIElNY3BTZXJ2ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElNY3BCZWhhdmlvckluc3RhbmNlIHtcbiAgICAvKipcbiAgICAgKiBVUkkgdW5pcXVlbHkgaWRlbnRpZnlpbmcgdGhpcyBpbnN0YW5jZSB3aXRoaW4gdGhlIE1DUCBzZXJ2ZXIuXG4gICAgICogVXNlZCBhcyB0aGUgcmVzb3VyY2UgaWRlbnRpZmllciBhbmQgYXMgdGhlIHJvdXRpbmcga2V5IGZvciB0b29sIGNhbGxzLlxuICAgICAqXG4gICAgICogQ29udmVudGlvbjogYGJhYnlsb246Ly88bmFtZXNwYWNlPi88b2JqZWN0TmFtZT5gXG4gICAgICogZS5nLiBgYmFieWxvbjovL21lc2gvaGVyb01lc2hgLCBgYmFieWxvbjovL2xpZ2h0L3N1bkxpZ2h0YFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHVyaTogc3RyaW5nO1xuXG4gICAgLyoqIFJldHVybnMgdGhlIHJlc291cmNlIG1ldGFkYXRhIChuYW1lLCBtaW1lVHlwZSwgZGVzY3JpcHRpb24pIGZvciB0aGlzIGluc3RhbmNlLiAqL1xuICAgIGdldFJlc291cmNlKCk6IE1jcFJlc291cmNlO1xuXG4gICAgLyoqIFJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyBvYmplY3Qgc2VyaWFsaXplZCBhcyByZXNvdXJjZSBjb250ZW50LiAqL1xuICAgIHJlYWRSZXNvdXJjZSgpOiBQcm9taXNlPE1jcFJlc291cmNlQ29udGVudD47XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0b29scyBleHBvc2VkIGJ5IHRoaXMgaW5zdGFuY2UuXG4gICAgICogVG9vbCBuYW1lcyBtdXN0IGJlIHByZWZpeGVkIHdpdGggdGhlIGJlaGF2aW9yIG5hbWVzcGFjZSxcbiAgICAgKiBlLmcuIGBcIm1lc2guZ2V0UG9zaXRpb25cImAsIGBcIm1lc2guc2V0UG9zaXRpb25cImAuXG4gICAgICovXG4gICAgZ2V0VG9vbHMoKTogTWNwVG9vbFtdO1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgYSBuYW1lc3BhY2VkIHRvb2wgb24gdGhpcyBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIC0gRnVsbCBuYW1lc3BhY2VkIHRvb2wgbmFtZSAoZS5nLiBgXCJtZXNoLnNldFBvc2l0aW9uXCJgKS5cbiAgICAgKiBAcGFyYW0gYXJncyAtIFRvb2wgYXJndW1lbnRzIGFzIGRlc2NyaWJlZCBieSB0aGUgdG9vbCdzIGBpbnB1dFNjaGVtYWAuXG4gICAgICogQHJldHVybnMgVGhlIHRvb2wncyByZXN1bHQgcGF5bG9hZC5cbiAgICAgKi9cbiAgICBjYWxsVG9vbChuYW1lOiBzdHJpbmcsIGFyZ3M6IHVua25vd24pOiBQcm9taXNlPHVua25vd24+O1xufVxuXG4vKipcbiAqIERlc2NyaWJlcyBhIGNhdGVnb3J5IG9mIG9iamVjdCBiZWhhdmlvciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBpbnN0YW5jZXMuXG4gKlxuICogQSBiZWhhdmlvciBpcyB0aGUgcmV1c2FibGUgXCJjYXBhYmlsaXR5IHRlbXBsYXRlXCIgZm9yIGEgc3BlY2lmaWMgdHlwZSBvZiBvYmplY3RcbiAqIChlLmcuIGBNZXNoQmVoYXZpb3JgLCBgTGlnaHRCZWhhdmlvcmAsIGBDYW1lcmFCZWhhdmlvcmApLiBJdCBrbm93cyBob3cgdG8gd3JhcFxuICogYW55IGluc3RhbmNlIG9mIGBUYCBpbnRvIGFuIHtAbGluayBJTWNwQmVoYXZpb3JJbnN0YW5jZX0gdGhhdCBleHBvc2VzIHRoYXRcbiAqIG9iamVjdCdzIHN0YXRlIGFuZCBvcGVyYXRpb25zIHRvIHRoZSBNQ1AgY2xpZW50LlxuICpcbiAqIE11bHRpcGxlIGluc3RhbmNlcyBvZiB0aGUgc2FtZSBiZWhhdmlvciB0eXBlIGNhbiBiZSBhdHRhY2hlZCB0byBkaWZmZXJlbnQgb2JqZWN0cy5cbiAqIEVhY2ggY2FsbCB0byB7QGxpbmsgYXR0YWNofSBwcm9kdWNlcyBhbiBpbmRlcGVuZGVudCB7QGxpbmsgSU1jcEJlaGF2aW9ySW5zdGFuY2V9LlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0eXBlIG9mIG9iamVjdCB0aGlzIGJlaGF2aW9yIG9wZXJhdGVzIG9uIChlLmcuIGBNZXNoYCwgYExpZ2h0YCkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGNsYXNzIE1lc2hCZWhhdmlvciBpbXBsZW1lbnRzIElNY3BCZWhhdmlvcjxNZXNoPiB7XG4gKiAgICAgcmVhZG9ubHkgbmFtZXNwYWNlID0gXCJtZXNoXCI7XG4gKlxuICogICAgIGF0dGFjaCh0YXJnZXQ6IE1lc2gpOiBJTWNwQmVoYXZpb3JJbnN0YW5jZSB7XG4gKiAgICAgICAgIHJldHVybiBuZXcgTWVzaEJlaGF2aW9ySW5zdGFuY2UodGFyZ2V0KTtcbiAqICAgICB9XG4gKiB9XG4gKlxuICogLy8gUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHR5cGUsIHRoZW4gYXR0YWNoIHNwZWNpZmljIG9iamVjdHM6XG4gKiBzZXJ2ZXIucmVnaXN0ZXJCZWhhdmlvcihuZXcgTWVzaEJlaGF2aW9yKCkpO1xuICogc2VydmVyLmF0dGFjaChoZXJvTWVzaCwgbWVzaEJlaGF2aW9yKTtcbiAqIHNlcnZlci5hdHRhY2goZ3JvdW5kTWVzaCwgbWVzaEJlaGF2aW9yKTtcbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElNY3BCZWhhdmlvcjxUID0gdW5rbm93bj4ge1xuICAgIC8qKlxuICAgICAqIFVuaXF1ZSBuYW1lc3BhY2UgZm9yIHRoaXMgYmVoYXZpb3IncyB0b29scy5cbiAgICAgKiBQcmVmaXhlZCB0byBhbGwgdG9vbCBuYW1lcyB0byBhdm9pZCBjb2xsaXNpb25zIGFjcm9zcyBiZWhhdmlvcnMuXG4gICAgICogZS5nLiBgXCJtZXNoXCJgIOKGkiB0b29scyBuYW1lZCBgXCJtZXNoLmdldFBvc2l0aW9uXCJgLCBgXCJtZXNoLnNldFBvc2l0aW9uXCJgLlxuICAgICAqXG4gICAgICogTXVzdCBiZSBsb3dlcmNhc2UsIGFscGhhbnVtZXJpYywgbm8gc3BhY2VzLlxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5hbWVzcGFjZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogUkZDIDY1NzAgVVJJIHRlbXBsYXRlIGRlc2NyaWJpbmcgdGhlIHJlc291cmNlIFVSSXMgcHJvZHVjZWQgYnkgdGhpcyBiZWhhdmlvci5cbiAgICAgKiBBZHZlcnRpc2VkIHZpYSBgcmVzb3VyY2VzL3RlbXBsYXRlcy9saXN0YCBzbyBjbGllbnRzIGNhbiBkaXNjb3ZlciB0aGUgVVJJXG4gICAgICogc2NoZW1lIGFuZCBjb25zdHJ1Y3QgdmFsaWQgaWRlbnRpZmllcnMgd2l0aG91dCBlbnVtZXJhdGluZyBldmVyeSBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlIGBcIm1lc2g6Ly9zY2VuZS97bWVzaE5hbWV9XCJgXG4gICAgICogQGV4YW1wbGUgYFwiY2FtZXJhOi8vc2NlbmUve2NhbWVyYU5hbWV9XCJgXG4gICAgICovXG4gICAgcmVhZG9ubHkgdXJpVGVtcGxhdGU/OiBzdHJpbmc7XG5cbiAgICAvKiogSHVtYW4tcmVhZGFibGUgbmFtZSBmb3IgdGhpcyBiZWhhdmlvciBjYXRlZ29yeSwgdXNlZCBpbiB0ZW1wbGF0ZSBsaXN0aW5ncy4gKi9cbiAgICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqIE9wdGlvbmFsIGRlc2NyaXB0aW9uIG9mIHdoYXQgaW5zdGFuY2VzIG9mIHRoaXMgYmVoYXZpb3IgcmVwcmVzZW50LiAqL1xuICAgIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gICAgLyoqIE1JTUUgdHlwZSBvZiBjb250ZW50IHJldHVybmVkIGJ5IGByZXNvdXJjZXMvcmVhZGAgZm9yIGluc3RhbmNlcyBvZiB0aGlzIGJlaGF2aW9yLiAqL1xuICAgIHJlYWRvbmx5IG1pbWVUeXBlPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBzcGVjaWZpYyBvYmplY3QgaW4gYW4ge0BsaW5rIElNY3BCZWhhdmlvckluc3RhbmNlfSwgbWFraW5nIGl0XG4gICAgICogdmlzaWJsZSB0byB0aGUgTUNQIGNsaWVudCBhcyBhIHJlc291cmNlIHdpdGggY2FsbGFibGUgdG9vbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIG9iamVjdCB0byBhdHRhY2ggdGhpcyBiZWhhdmlvciB0by5cbiAgICAgKiBAcmV0dXJucyBBIG5ldyBpbnN0YW5jZSByZXByZXNlbnRpbmcgYHRhcmdldGAgaW4gdGhlIE1DUCBzZXJ2ZXIuXG4gICAgICovXG4gICAgYXR0YWNoKHRhcmdldDogVCk6IElNY3BCZWhhdmlvckluc3RhbmNlO1xufVxuIiwiLyoqXHJcbiAqIERlc2NyaWJlcyBhIHBhcmFtZXRlcml6ZWQgVVJJIHBhdHRlcm4gZm9yIHJlc291cmNlcyBleHBvc2VkIGJ5IGFuIE1DUCBzZXJ2ZXIuXHJcbiAqIFJldHVybmVkIGJ5IGByZXNvdXJjZXMvdGVtcGxhdGVzL2xpc3RgIHNvIGNsaWVudHMgY2FuIGRpc2NvdmVyIHdoYXQga2luZHMgb2ZcclxuICogcmVzb3VyY2VzIGV4aXN0IGFuZCBob3cgdG8gY29uc3RydWN0IHZhbGlkIFVSSXMgZm9yIHRoZW0uXHJcbiAqXHJcbiAqIFVSSSB0ZW1wbGF0ZXMgZm9sbG93IFJGQyA2NTcwIOKAlCB2YXJpYWJsZXMgYXJlIGVuY2xvc2VkIGluIGB7YCBgfWAuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogY29uc3QgdGVtcGxhdGU6IE1jcFJlc291cmNlVGVtcGxhdGUgPSB7XHJcbiAqICAgICB1cmlUZW1wbGF0ZTogXCJtZXNoOi8vc2NlbmUve21lc2hOYW1lfVwiLFxyXG4gKiAgICAgbmFtZTogXCJCYWJ5bG9uIE1lc2hcIixcclxuICogICAgIGRlc2NyaXB0aW9uOiBcIkEgbmFtZWQgbWVzaCBpbiB0aGUgYWN0aXZlIEJhYnlsb24uanMgc2NlbmUuXCIsXHJcbiAqICAgICBtaW1lVHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAqIH07XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BSZXNvdXJjZVRlbXBsYXRlIHtcclxuICAgIC8qKiBSRkMgNjU3MCBVUkkgdGVtcGxhdGUsIGUuZy4gYFwibWVzaDovL3NjZW5lL3ttZXNoTmFtZX1cImAuICovXHJcbiAgICB1cmlUZW1wbGF0ZTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBIdW1hbi1yZWFkYWJsZSBkaXNwbGF5IG5hbWUgZm9yIHRoaXMgdGVtcGxhdGUgY2F0ZWdvcnkuICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIE9wdGlvbmFsIGRlc2NyaXB0aW9uIG9mIHdoYXQgcmVzb3VyY2VzIG1hdGNoaW5nIHRoaXMgdGVtcGxhdGUgcmVwcmVzZW50LiAqL1xyXG4gICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIE9wdGlvbmFsIE1JTUUgdHlwZSBvZiB0aGUgY29udGVudCByZXR1cm5lZCBieSBgcmVzb3VyY2VzL3JlYWRgIGZvciB0aGVzZSBVUklzLiAqL1xyXG4gICAgbWltZVR5cGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZXMgYSByZXNvdXJjZSBleHBvc2VkIGJ5IGFuIE1DUCBzZXJ2ZXIgdGhhdCBjbGllbnRzIGNhbiByZWFkLlxyXG4gKiBSZXNvdXJjZXMgcmVwcmVzZW50IGFueSBraW5kIG9mIGRhdGE6IGZpbGVzLCBkYXRhYmFzZSByZWNvcmRzLCBBUEkgcmVzcG9uc2VzLCBldGMuXHJcbiAqXHJcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbW9kZWxjb250ZXh0cHJvdG9jb2wuaW8vZG9jcy9jb25jZXB0cy9yZXNvdXJjZXMgTUNQIFJlc291cmNlc31cclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHlwZXNjcmlwdFxyXG4gKiBjb25zdCByZXNvdXJjZTogTWNwUmVzb3VyY2UgPSB7XHJcbiAqICAgICB1cmk6IFwiZmlsZTovLy9wcm9qZWN0L3NyYy9pbmRleC50c1wiLFxyXG4gKiAgICAgbmFtZTogXCJpbmRleC50c1wiLFxyXG4gKiAgICAgbWltZVR5cGU6IFwidGV4dC90eXBlc2NyaXB0XCIsXHJcbiAqICAgICBkZXNjcmlwdGlvbjogXCJBcHBsaWNhdGlvbiBlbnRyeSBwb2ludFwiLFxyXG4gKiB9O1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWNwUmVzb3VyY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHJlc291cmNlLCBmb3JtYXR0ZWQgYXMgYSBVUkkuXHJcbiAgICAgKiBTdXBwb3J0cyBzdGFuZGFyZCBzY2hlbWVzIHN1Y2ggYXMgYGZpbGU6Ly9gLCBgaHR0cHM6Ly9gLCBvciBjdXN0b20gb25lcy5cclxuICAgICAqL1xyXG4gICAgdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIEh1bWFuLXJlYWRhYmxlIGRpc3BsYXkgbmFtZSBmb3IgdGhlIHJlc291cmNlLiAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBNSU1FIHR5cGUgb2YgdGhlIHJlc291cmNlIGNvbnRlbnQgKGUuZy4gYFwidGV4dC9wbGFpblwiYCwgYFwiYXBwbGljYXRpb24vanNvblwiYCkuICovXHJcbiAgICBtaW1lVHlwZTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBPcHRpb25hbCBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbiBvZiB3aGF0IHRoZSByZXNvdXJjZSBjb250YWlucy4gKi9cclxuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogSG9sZHMgdGhlIGFjdHVhbCBjb250ZW50IG9mIGEgcmVzb3VyY2UgcmV0cmlldmVkIGZyb20gYW4gTUNQIHNlcnZlci5cclxuICogUmV0dXJuZWQgaW4gcmVzcG9uc2UgdG8gYSBgcmVzb3VyY2VzL3JlYWRgIHJlcXVlc3QuXHJcbiAqXHJcbiAqIEBzZWUge0BsaW5rIE1jcFJlc291cmNlfSBmb3IgdGhlIHJlc291cmNlIG1ldGFkYXRhIGNvdW50ZXJwYXJ0LlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BSZXNvdXJjZUNvbnRlbnQge1xyXG4gICAgLyoqIFVSSSBvZiB0aGUgcmVzb3VyY2UgdGhpcyBjb250ZW50IGJlbG9uZ3MgdG8sIG1hdGNoaW5nIHtAbGluayBNY3BSZXNvdXJjZS51cml9LiAqL1xyXG4gICAgdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIE1JTUUgdHlwZSBvZiB0aGUgY29udGVudCAoZS5nLiBgXCJ0ZXh0L3BsYWluXCJgLCBgXCJhcHBsaWNhdGlvbi9qc29uXCJgKS4gKi9cclxuICAgIG1pbWVUeXBlOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFRoZSByYXcgdGV4dCBjb250ZW50IG9mIHRoZSByZXNvdXJjZS4gKi9cclxuICAgIHRleHQ6IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIERlc2NyaWJlcyBhIHRvb2wgZXhwb3NlZCBieSBhbiBNQ1Agc2VydmVyIHRoYXQgY2xpZW50cyBjYW4gaW52b2tlLlxyXG4gKiBUb29scyByZXByZXNlbnQgZXhlY3V0YWJsZSBvcGVyYXRpb25zIHN1Y2ggYXMgcnVubmluZyBhIGNvbW1hbmQsIHF1ZXJ5aW5nIGEgZGF0YWJhc2UsIG9yIGNhbGxpbmcgYW4gQVBJLlxyXG4gKlxyXG4gKiBAc2VlIHtAbGluayBodHRwczovL21vZGVsY29udGV4dHByb3RvY29sLmlvL2RvY3MvY29uY2VwdHMvdG9vbHMgTUNQIFRvb2xzfVxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIGNvbnN0IHRvb2w6IE1jcFRvb2wgPSB7XHJcbiAqICAgICBuYW1lOiBcInJlYWRfZmlsZVwiLFxyXG4gKiAgICAgZGVzY3JpcHRpb246IFwiUmVhZHMgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIGF0IHRoZSBnaXZlbiBwYXRoLlwiLFxyXG4gKiAgICAgaW5wdXRTY2hlbWE6IHtcclxuICogICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxyXG4gKiAgICAgICAgIHByb3BlcnRpZXM6IHsgcGF0aDogeyB0eXBlOiBcInN0cmluZ1wiIH0gfSxcclxuICogICAgICAgICByZXF1aXJlZDogW1wicGF0aFwiXSxcclxuICogICAgIH0sXHJcbiAqIH07XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BUb29sIHtcclxuICAgIC8qKiBVbmlxdWUgbmFtZSB1c2VkIHRvIGludm9rZSB0aGlzIHRvb2wgdmlhIGB0b29scy9jYWxsYC4gKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKiogSHVtYW4tcmVhZGFibGUgZXhwbGFuYXRpb24gb2Ygd2hhdCB0aGUgdG9vbCBkb2VzIGFuZCB3aGVuIHRvIHVzZSBpdC4gKi9cclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBKU09OIFNjaGVtYSBvYmplY3QgZGVzY3JpYmluZyB0aGUgZXhwZWN0ZWQgaW5wdXQgcGFyYW1ldGVycy5cclxuICAgICAqIENsaWVudHMgYW5kIExMTXMgdXNlIHRoaXMgc2NoZW1hIHRvIHZhbGlkYXRlIGFuZCBjb25zdHJ1Y3QgYXJndW1lbnRzIGJlZm9yZSBjYWxsaW5nIHRoZSB0b29sLlxyXG4gICAgICovXHJcbiAgICBpbnB1dFNjaGVtYTogb2JqZWN0O1xyXG59XHJcblxyXG4vKipcclxuICogSWRlbnRpZmllcyBhbiBNQ1AgY2xpZW50IGFwcGxpY2F0aW9uLlxyXG4gKiBTZW50IGJ5IHRoZSBjbGllbnQgZHVyaW5nIHRoZSBgaW5pdGlhbGl6ZWAgaGFuZHNoYWtlLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BDbGllbnRJbmZvIHtcclxuICAgIC8qKiBIdW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSBjbGllbnQgYXBwbGljYXRpb24gKGUuZy4gYFwiTXkgQUkgQXBwXCJgKS4gKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKiogVmVyc2lvbiBzdHJpbmcgb2YgdGhlIGNsaWVudCBhcHBsaWNhdGlvbiAoZS5nLiBgXCIxLjAuMFwiYCkuICovXHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJZGVudGlmaWVzIGFuIE1DUCBzZXJ2ZXIgaW1wbGVtZW50YXRpb24uXHJcbiAqIFJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIgZHVyaW5nIHRoZSBgaW5pdGlhbGl6ZWAgaGFuZHNoYWtlLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BTZXJ2ZXJJbmZvIHtcclxuICAgIC8qKiBIdW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSBzZXJ2ZXIgKGUuZy4gYFwiYmFieWxvbi1tY3Atc2VydmVyXCJgKS4gKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKiogVmVyc2lvbiBzdHJpbmcgb2YgdGhlIHNlcnZlciAoZS5nLiBgXCIxLjAuMFwiYCkuICovXHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYXBhYmlsaXRpZXMgYWR2ZXJ0aXNlZCBieSBhbiBNQ1AgY2xpZW50IGR1cmluZyBpbml0aWFsaXphdGlvbi5cclxuICpcclxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tb2RlbGNvbnRleHRwcm90b2NvbC5pby9kb2NzL2NvbmNlcHRzL2FyY2hpdGVjdHVyZSBNQ1AgQXJjaGl0ZWN0dXJlfVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BDbGllbnRDYXBhYmlsaXRpZXMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbmRpY2F0ZXMgdGhlIGNsaWVudCBzdXBwb3J0cyByb290IFVSSXMuXHJcbiAgICAgKiBgbGlzdENoYW5nZWRgIHNpZ25hbHMgdGhlIGNsaWVudCB3aWxsIGVtaXQgbm90aWZpY2F0aW9ucyB3aGVuIHJvb3RzIGNoYW5nZS5cclxuICAgICAqL1xyXG4gICAgcm9vdHM/OiB7XHJcbiAgICAgICAgbGlzdENoYW5nZWQ/OiBib29sZWFuO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogSW5kaWNhdGVzIHRoZSBjbGllbnQgc3VwcG9ydHMgTExNIHNhbXBsaW5nIHJlcXVlc3RzIGluaXRpYXRlZCBieSB0aGUgc2VydmVyLiAqL1xyXG4gICAgc2FtcGxpbmc/OiBSZWNvcmQ8c3RyaW5nLCBuZXZlcj47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYXBhYmlsaXRpZXMgYWR2ZXJ0aXNlZCBieSBhbiBNQ1Agc2VydmVyIGR1cmluZyBpbml0aWFsaXphdGlvbi5cclxuICogRWFjaCBrZXkgY29ycmVzcG9uZHMgdG8gYSBmZWF0dXJlIGdyb3VwIHRoZSBzZXJ2ZXIgb3B0cyBpbnRvLlxyXG4gKlxyXG4gKiBAc2VlIHtAbGluayBodHRwczovL21vZGVsY29udGV4dHByb3RvY29sLmlvL2RvY3MvY29uY2VwdHMvYXJjaGl0ZWN0dXJlIE1DUCBBcmNoaXRlY3R1cmV9XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIE1jcFNlcnZlckNhcGFiaWxpdGllcyB7XHJcbiAgICAvKipcclxuICAgICAqIEluZGljYXRlcyB0aGUgc2VydmVyIGV4cG9zZXMgcmVzb3VyY2VzLlxyXG4gICAgICogLSBgc3Vic2NyaWJlYDogY2xpZW50cyBtYXkgc3Vic2NyaWJlIHRvIHJlc291cmNlIGNoYW5nZSBub3RpZmljYXRpb25zLlxyXG4gICAgICogLSBgbGlzdENoYW5nZWRgOiBzZXJ2ZXIgd2lsbCBlbWl0IGBub3RpZmljYXRpb25zL3Jlc291cmNlcy9saXN0X2NoYW5nZWRgIHdoZW4gdGhlIGxpc3QgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgcmVzb3VyY2VzPzoge1xyXG4gICAgICAgIHN1YnNjcmliZT86IGJvb2xlYW47XHJcbiAgICAgICAgbGlzdENoYW5nZWQ/OiBib29sZWFuO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluZGljYXRlcyB0aGUgc2VydmVyIGV4cG9zZXMgdG9vbHMuXHJcbiAgICAgKiBgbGlzdENoYW5nZWRgOiBzZXJ2ZXIgd2lsbCBlbWl0IGBub3RpZmljYXRpb25zL3Rvb2xzL2xpc3RfY2hhbmdlZGAgd2hlbiB0aGUgbGlzdCBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICB0b29scz86IHtcclxuICAgICAgICBsaXN0Q2hhbmdlZD86IGJvb2xlYW47XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5kaWNhdGVzIHRoZSBzZXJ2ZXIgZXhwb3NlcyBwcm9tcHRzLlxyXG4gICAgICogYGxpc3RDaGFuZ2VkYDogc2VydmVyIHdpbGwgZW1pdCBgbm90aWZpY2F0aW9ucy9wcm9tcHRzL2xpc3RfY2hhbmdlZGAgd2hlbiB0aGUgbGlzdCBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcm9tcHRzPzoge1xyXG4gICAgICAgIGxpc3RDaGFuZ2VkPzogYm9vbGVhbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgc2VydmVyIHN1cHBvcnRzIHN0cnVjdHVyZWQgbG9nZ2luZyB2aWEgYGxvZ2dpbmcvc2V0TGV2ZWxgLiAqL1xyXG4gICAgbG9nZ2luZz86IFJlY29yZDxzdHJpbmcsIG5ldmVyPjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBkb21haW4tbGV2ZWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHtAbGluayBJTWNwSW5pdGlhbGl6ZXJ9LlxyXG4gKiBDb250YWlucyBvbmx5IHRoZSBzZXJ2ZXItc3VwcGxpZWQgcGFydHMgb2YgdGhlIGhhbmRzaGFrZSDigJQgcHJvdG9jb2wgdmVyc2lvbixcclxuICogaWRlbnRpdHksIGFuZCBvcHRpb25hbCBpbnN0cnVjdGlvbnMuIENhcGFiaWxpdGllcyBhcmUgaW50ZW50aW9uYWxseSBleGNsdWRlZFxyXG4gKiBoZXJlIGJlY2F1c2UgdGhleSBhcmUgZGVyaXZlZCBhdXRvbWF0aWNhbGx5IGZyb20gcmVnaXN0ZXJlZCBiZWhhdmlvcnMgYXRcclxuICogcnVudGltZSBieSB0aGUgc2VydmVyLlxyXG4gKlxyXG4gKiBAc2VlIHtAbGluayBNY3BJbml0aWFsaXplUmVzdWx0fSBmb3IgdGhlIGZ1bGwgd2lyZS1sZXZlbCByZXNwb25zZS5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWNwU2VydmVySWRlbnRpdHkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgTUNQIHByb3RvY29sIHZlcnNpb24gdGhlIHNlcnZlciB3aWxsIHVzZSBmb3IgdGhpcyBzZXNzaW9uLlxyXG4gICAgICogU2hvdWxkIG1hdGNoIG9yIGJlIGNvbXBhdGlibGUgd2l0aCB0aGUgdmVyc2lvbiByZXF1ZXN0ZWQgYnkgdGhlIGNsaWVudC5cclxuICAgICAqL1xyXG4gICAgcHJvdG9jb2xWZXJzaW9uOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIE1ldGFkYXRhIGlkZW50aWZ5aW5nIHRoaXMgc2VydmVyIGltcGxlbWVudGF0aW9uLiAqL1xyXG4gICAgc2VydmVySW5mbzogTWNwU2VydmVySW5mbztcclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wdGlvbmFsIGh1bWFuLXJlYWRhYmxlIGluc3RydWN0aW9ucyBmb3IgdGhlIGNsaWVudCBvciBMTE0gYWJvdXRcclxuICAgICAqIGhvdyB0byBpbnRlcmFjdCB3aXRoIHRoaXMgc2VydmVyIChlLmcuIHVzYWdlIG5vdGVzLCBjb25zdHJhaW50cykuXHJcbiAgICAgKi9cclxuICAgIGluc3RydWN0aW9ucz86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIEZ1bGwgcmVzdWx0IHJldHVybmVkIG92ZXIgdGhlIHdpcmUgaW4gcmVzcG9uc2UgdG8gYW4gYGluaXRpYWxpemVgIHJlcXVlc3QuXHJcbiAqIEJ1aWx0IGJ5IHRoZSBzZXJ2ZXIgYnkgbWVyZ2luZyB7QGxpbmsgTWNwU2VydmVySWRlbnRpdHl9IHdpdGggYXV0by1kZXJpdmVkXHJcbiAqIGNhcGFiaWxpdGllcyBmcm9tIGFsbCByZWdpc3RlcmVkIGJlaGF2aW9ycy5cclxuICpcclxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tb2RlbGNvbnRleHRwcm90b2NvbC5pby9kb2NzL2NvbmNlcHRzL2FyY2hpdGVjdHVyZSBNQ1AgQXJjaGl0ZWN0dXJlfVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBNY3BJbml0aWFsaXplUmVzdWx0IGV4dGVuZHMgTWNwU2VydmVySWRlbnRpdHkge1xyXG4gICAgLyoqIFRoZSBmZWF0dXJlIHNldCB0aGlzIHNlcnZlciBzdXBwb3J0cywgZGVyaXZlZCBmcm9tIHJlZ2lzdGVyZWQgYmVoYXZpb3JzLiAqL1xyXG4gICAgY2FwYWJpbGl0aWVzOiBNY3BTZXJ2ZXJDYXBhYmlsaXRpZXM7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBKU09OLVJQQyAyLjAgcmVxdWVzdCBvYmplY3Qgc2VudCBmcm9tIGNsaWVudCB0byBzZXJ2ZXIuXHJcbiAqXHJcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb24jcmVxdWVzdF9vYmplY3QgSlNPTi1SUEMgMi4wIFNwZWNpZmljYXRpb259XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogY29uc3QgcmVxdWVzdDogSnNvblJwY1JlcXVlc3QgPSB7XHJcbiAqICAgICBqc29ucnBjOiBcIjIuMFwiLFxyXG4gKiAgICAgaWQ6IDEsXHJcbiAqICAgICBtZXRob2Q6IFwidG9vbHMvbGlzdFwiLFxyXG4gKiAgICAgcGFyYW1zOiB7IGN1cnNvcjogdW5kZWZpbmVkIH0sXHJcbiAqIH07XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBKc29uUnBjUmVxdWVzdCB7XHJcbiAgICAvKiogSlNPTi1SUEMgcHJvdG9jb2wgdmVyc2lvbi4gTXVzdCBhbHdheXMgYmUgYFwiMi4wXCJgLiAqL1xyXG4gICAganNvbnJwYzogXCIyLjBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlcXVlc3QgaWRlbnRpZmllciB1c2VkIHRvIG1hdGNoIHJlc3BvbnNlcyB0byByZXF1ZXN0cy5cclxuICAgICAqIE11c3QgYmUgdW5pcXVlIHdpdGhpbiBhIHNlc3Npb24uIENhbiBiZSBhIHN0cmluZyBvciBpbnRlZ2VyLlxyXG4gICAgICovXHJcbiAgICBpZDogc3RyaW5nIHwgbnVtYmVyO1xyXG5cclxuICAgIC8qKiBUaGUgbmFtZSBvZiB0aGUgcmVtb3RlIG1ldGhvZCB0byBpbnZva2UuICovXHJcbiAgICBtZXRob2Q6IHN0cmluZztcclxuXHJcbiAgICAvKiogT3B0aW9uYWwgcGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSBtZXRob2QuIFN0cnVjdHVyZSBkZXBlbmRzIG9uIHRoZSBtZXRob2QuICovXHJcbiAgICBwYXJhbXM/OiB1bmtub3duO1xyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIEpTT04tUlBDIDIuMCByZXNwb25zZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cclxuICogQ29udGFpbnMgZWl0aGVyIGEgYHJlc3VsdGAgb24gc3VjY2VzcyBvciBhbiBgZXJyb3JgIG9uIGZhaWx1cmUg4oCUIG5ldmVyIGJvdGguXHJcbiAqXHJcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb24jcmVzcG9uc2Vfb2JqZWN0IEpTT04tUlBDIDIuMCBTcGVjaWZpY2F0aW9ufVxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIC8vIFN1Y2Nlc3NcclxuICogY29uc3QgcmVzcG9uc2U6IEpzb25ScGNSZXNwb25zZSA9IHsganNvbnJwYzogXCIyLjBcIiwgaWQ6IDEsIHJlc3VsdDogeyB0b29sczogW10gfSB9O1xyXG4gKlxyXG4gKiAvLyBGYWlsdXJlXHJcbiAqIGNvbnN0IHJlc3BvbnNlOiBKc29uUnBjUmVzcG9uc2UgPSB7IGpzb25ycGM6IFwiMi4wXCIsIGlkOiAxLCBlcnJvcjogeyBjb2RlOiAtMzI2MDAsIG1lc3NhZ2U6IFwiSW52YWxpZCBSZXF1ZXN0XCIgfSB9O1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSnNvblJwY1Jlc3BvbnNlIHtcclxuICAgIC8qKiBKU09OLVJQQyBwcm90b2NvbCB2ZXJzaW9uLiBNdXN0IGFsd2F5cyBiZSBgXCIyLjBcImAuICovXHJcbiAgICBqc29ucnBjOiBcIjIuMFwiO1xyXG5cclxuICAgIC8qKiBJZGVudGlmaWVyIG1hdGNoaW5nIHRoZSBvcmlnaW5hdGluZyB7QGxpbmsgSnNvblJwY1JlcXVlc3R9LiAqL1xyXG4gICAgaWQ6IHN0cmluZyB8IG51bWJlcjtcclxuXHJcbiAgICAvKiogVGhlIHJlc3VsdCBwYXlsb2FkIG9uIHN1Y2Nlc3MuIE11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIHtAbGluayBKc29uUnBjUmVzcG9uc2UuZXJyb3J9LiAqL1xyXG4gICAgcmVzdWx0PzogdW5rbm93bjtcclxuXHJcbiAgICAvKiogVGhlIGVycm9yIHBheWxvYWQgb24gZmFpbHVyZS4gTXV0dWFsbHkgZXhjbHVzaXZlIHdpdGgge0BsaW5rIEpzb25ScGNSZXNwb25zZS5yZXN1bHR9LiAqL1xyXG4gICAgZXJyb3I/OiBKc29uUnBjRXJyb3I7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIGEgSlNPTi1SUEMgMi4wIG5vdGlmaWNhdGlvbiDigJQgYSByZXF1ZXN0IHdpdGggbm8gZXhwZWN0ZWQgcmVzcG9uc2UuXHJcbiAqIE5vdGlmaWNhdGlvbnMgZG8gbm90IGNhcnJ5IGFuIGBpZGAgZmllbGQsIHNvIHRoZSBzZXJ2ZXIgbXVzdCBub3QgcmVwbHkuXHJcbiAqXHJcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb24jbm90aWZpY2F0aW9uIEpTT04tUlBDIDIuMCBTcGVjaWZpY2F0aW9ufVxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIGNvbnN0IG5vdGlmaWNhdGlvbjogSnNvblJwY05vdGlmaWNhdGlvbiA9IHtcclxuICogICAgIGpzb25ycGM6IFwiMi4wXCIsXHJcbiAqICAgICBtZXRob2Q6IFwibm90aWZpY2F0aW9ucy9wcm9ncmVzc1wiLFxyXG4gKiAgICAgcGFyYW1zOiB7IHByb2dyZXNzVG9rZW46IFwiYWJjXCIsIHByb2dyZXNzOiA1MCwgdG90YWw6IDEwMCB9LFxyXG4gKiB9O1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSnNvblJwY05vdGlmaWNhdGlvbiB7XHJcbiAgICAvKiogSlNPTi1SUEMgcHJvdG9jb2wgdmVyc2lvbi4gTXVzdCBhbHdheXMgYmUgYFwiMi4wXCJgLiAqL1xyXG4gICAganNvbnJwYzogXCIyLjBcIjtcclxuXHJcbiAgICAvKiogVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBiZWluZyBub3RpZmllZC4gKi9cclxuICAgIG1ldGhvZDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBPcHRpb25hbCBwYXJhbWV0ZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbm90aWZpY2F0aW9uLiAqL1xyXG4gICAgcGFyYW1zPzogdW5rbm93bjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBKU09OLVJQQyAyLjAgZXJyb3Igb2JqZWN0IGluY2x1ZGVkIGluIGEgZmFpbGVkIHtAbGluayBKc29uUnBjUmVzcG9uc2V9LlxyXG4gKlxyXG4gKiBTdGFuZGFyZCBlcnJvciBjb2RlczpcclxuICogLSBgLTMyNzAwYCDigJQgUGFyc2UgZXJyb3JcclxuICogLSBgLTMyNjAwYCDigJQgSW52YWxpZCBSZXF1ZXN0XHJcbiAqIC0gYC0zMjYwMWAg4oCUIE1ldGhvZCBub3QgZm91bmRcclxuICogLSBgLTMyNjAyYCDigJQgSW52YWxpZCBwYXJhbXNcclxuICogLSBgLTMyNjAzYCDigJQgSW50ZXJuYWwgZXJyb3JcclxuICpcclxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuanNvbnJwYy5vcmcvc3BlY2lmaWNhdGlvbiNlcnJvcl9vYmplY3QgSlNPTi1SUEMgMi4wIFNwZWNpZmljYXRpb259XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEpzb25ScGNFcnJvciB7XHJcbiAgICAvKipcclxuICAgICAqIE51bWVyaWMgZXJyb3IgY29kZSBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIGZhaWx1cmUuXHJcbiAgICAgKiBWYWx1ZXMgZnJvbSBgLTMyNzY4YCB0byBgLTMyMDAwYCBhcmUgcmVzZXJ2ZWQgZm9yIHByZS1kZWZpbmVkIGVycm9ycy5cclxuICAgICAqL1xyXG4gICAgY29kZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBIdW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuICovXHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIE9wdGlvbmFsIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLiBNYXkgYmUgYW55IHNlcmlhbGl6YWJsZSB2YWx1ZS4gKi9cclxuICAgIGRhdGE/OiB1bmtub3duO1xyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgTWNwQ2xpZW50Q2FwYWJpbGl0aWVzLCBNY3BDbGllbnRJbmZvLCBNY3BTZXJ2ZXJJZGVudGl0eSB9IGZyb20gXCIuL21jcC5jb3JlLmludGVyZmFjZXNcIjtcclxuaW1wb3J0IHR5cGUgeyBJTWNwQmVoYXZpb3IsIElNY3BCZWhhdmlvckluc3RhbmNlIH0gZnJvbSBcIi4vbWNwLmJlaGF2aW9yLmludGVyZmFjZXNcIjtcclxuaW1wb3J0IHR5cGUgeyBKc29uUnBjUmVxdWVzdCwgSnNvblJwY1Jlc3BvbnNlIH0gZnJvbSBcIi4vbWNwLmpzb25ycGMuaW50ZXJmYWNlc1wiO1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZXMgdGhlIGRvbWFpbi1sZXZlbCBNQ1AgaW5pdGlhbGl6YXRpb24gaGFuZHNoYWtlLlxyXG4gKlxyXG4gKiBSZXNwb25zaWJsZSBmb3IgcHJvdG9jb2wgdmVyc2lvbiBuZWdvdGlhdGlvbiBhbmQgc2VydmVyIGlkZW50aXR5LlxyXG4gKiBDYXBhYmlsaXRpZXMgYXJlIGludGVudGlvbmFsbHkgZXhjbHVkZWQg4oCUIHRoZSBzZXJ2ZXIgZGVyaXZlcyB0aGVtXHJcbiAqIGF1dG9tYXRpY2FsbHkgZnJvbSBhbGwgcmVnaXN0ZXJlZCB7QGxpbmsgSU1jcEJlaGF2aW9yfXMgYXQgaGFuZHNoYWtlIHRpbWUuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogY2xhc3MgTXlJbml0aWFsaXplciBpbXBsZW1lbnRzIElNY3BJbml0aWFsaXplciB7XHJcbiAqICAgICBpbml0aWFsaXplKF9jbGllbnRJbmZvOiBNY3BDbGllbnRJbmZvLCBfY2FwczogTWNwQ2xpZW50Q2FwYWJpbGl0aWVzKTogTWNwU2VydmVySWRlbnRpdHkge1xyXG4gKiAgICAgICAgIHJldHVybiB7XHJcbiAqICAgICAgICAgICAgIHByb3RvY29sVmVyc2lvbjogXCIyMDI0LTExLTA1XCIsXHJcbiAqICAgICAgICAgICAgIHNlcnZlckluZm86IHsgbmFtZTogXCJiYWJ5bG9uLW1jcC1zZXJ2ZXJcIiwgdmVyc2lvbjogXCIxLjAuMFwiIH0sXHJcbiAqICAgICAgICAgICAgIGluc3RydWN0aW9uczogXCJJbnRlcmFjdCB3aXRoIHRoZSBhY3RpdmUgQmFieWxvbi5qcyBzY2VuZS5cIixcclxuICogICAgICAgICB9O1xyXG4gKiAgICAgfVxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTWNwSW5pdGlhbGl6ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gY2xpZW50SW5mbyAtIElkZW50aXR5IG9mIHRoZSBjb25uZWN0aW5nIGNsaWVudC5cclxuICAgICAqIEBwYXJhbSBjbGllbnRDYXBhYmlsaXRpZXMgLSBGZWF0dXJlcyB0aGUgY2xpZW50IGRlY2xhcmVzIGl0IHN1cHBvcnRzLlxyXG4gICAgICogQHJldHVybnMgU2VydmVyIGlkZW50aXR5IGFuZCBwcm90b2NvbCB2ZXJzaW9uLiBDYXBhYmlsaXRpZXMgYXJlIGF1dG8tZGVyaXZlZFxyXG4gICAgICogICAgICAgICAgYnkgdGhlIHNlcnZlciBhbmQgbXVzdCBub3QgYmUgaW5jbHVkZWQgaGVyZS5cclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZShjbGllbnRJbmZvOiBNY3BDbGllbnRJbmZvLCBjbGllbnRDYXBhYmlsaXRpZXM6IE1jcENsaWVudENhcGFiaWxpdGllcyk6IE1jcFNlcnZlcklkZW50aXR5O1xyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlcyBKU09OLVJQQyBwcm90b2NvbC1sZXZlbCBNQ1AgcmVxdWVzdHMsIHJvdXRpbmcgdGhlbSB0byB0aGUgZG9tYWluIGxheWVyLlxyXG4gKlxyXG4gKiBFYWNoIG1ldGhvZCBtYXBzIHRvIG9uZSBNQ1AgcHJvdG9jb2wgbWV0aG9kOlxyXG4gKiAtIGBpbml0aWFsaXplYCAgICAgICAgICAgICAg4oaSIGBpbml0aWFsaXplYFxyXG4gKiAtIGByZXNvdXJjZXNMaXN0YCAgICAgICAgICAg4oaSIGByZXNvdXJjZXMvbGlzdGBcclxuICogLSBgcmVzb3VyY2VzVGVtcGxhdGVzTGlzdGAgIOKGkiBgcmVzb3VyY2VzL3RlbXBsYXRlcy9saXN0YFxyXG4gKiAtIGByZXNvdXJjZXNSZWFkYCAgICAgICAgICAg4oaSIGByZXNvdXJjZXMvcmVhZGBcclxuICogLSBgdG9vbHNMaXN0YCAgICAgICAgICAgICAgIOKGkiBgdG9vbHMvbGlzdGBcclxuICogLSBgdG9vbHNDYWxsYCAgICAgICAgICAgICAgIOKGkiBgdG9vbHMvY2FsbGBcclxuICpcclxuICogQWdncmVnYXRlcyByZXN1bHRzIGFjcm9zcyBhbGwgcmVnaXN0ZXJlZCB7QGxpbmsgSU1jcEJlaGF2aW9yfXMgYW5kIHRoZWlyIGluc3RhbmNlcy5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1jcFNlcnZlckhhbmRsZXJzIHtcclxuICAgIGluaXRpYWxpemUocmVxOiBKc29uUnBjUmVxdWVzdCk6IEpzb25ScGNSZXNwb25zZTtcclxuICAgIHJlc291cmNlc0xpc3QocmVxOiBKc29uUnBjUmVxdWVzdCk6IEpzb25ScGNSZXNwb25zZTtcclxuICAgIHJlc291cmNlc1RlbXBsYXRlc0xpc3QocmVxOiBKc29uUnBjUmVxdWVzdCk6IEpzb25ScGNSZXNwb25zZTtcclxuICAgIHJlc291cmNlc1JlYWQocmVxOiBKc29uUnBjUmVxdWVzdCk6IFByb21pc2U8SnNvblJwY1Jlc3BvbnNlPjtcclxuICAgIHRvb2xzTGlzdChyZXE6IEpzb25ScGNSZXF1ZXN0KTogSnNvblJwY1Jlc3BvbnNlO1xyXG4gICAgdG9vbHNDYWxsKHJlcTogSnNvblJwY1JlcXVlc3QpOiBQcm9taXNlPEpzb25ScGNSZXNwb25zZT47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGFuIHtAbGluayBJTWNwU2VydmVyfSBpbnN0YW5jZS5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1jcFNlcnZlck9wdGlvbnMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSB0aGUgV2ViU29ja2V0IGNvbm5lY3Rpb24gYWZ0ZXIgdGhpcyBtYW55IG1pbGxpc2Vjb25kcyBvZiBpbmFjdGl2aXR5XHJcbiAgICAgKiAoaS5lLiBubyBtZXNzYWdlIHJlY2VpdmVkKS4gVGhlIHRpbWVyIHJlc2V0cyBvbiBldmVyeSBpbmNvbWluZyBtZXNzYWdlLlxyXG4gICAgICogT21pdCB0byBkaXNhYmxlIGlkbGUgZGV0ZWN0aW9uLlxyXG4gICAgICovXHJcbiAgICBpZGxlVGltZW91dE1zPzogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBBdXRvbWF0aWMgcmVjb25uZWN0aW9uIHBvbGljeSBhcHBsaWVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gZHJvcHMgdW5leHBlY3RlZGx5LiAqL1xyXG4gICAgcmVjb25uZWN0Pzoge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWwgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgZmlyc3QgcmVjb25uZWN0aW9uIGF0dGVtcHQuXHJcbiAgICAgICAgICogU3Vic2VxdWVudCBhdHRlbXB0cyB1c2UgZXhwb25lbnRpYWwgYmFjay1vZmY6IGBtaW4oYmFzZURlbGF5TXMgKiAyXm4sIG1heERlbGF5TXMpYC5cclxuICAgICAgICAgKiBAZGVmYXVsdCAxMDAwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmFzZURlbGF5TXM/OiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwcGVyIGJvdW5kIG9uIHRoZSByZWNvbm5lY3Rpb24gZGVsYXkgaW4gbWlsbGlzZWNvbmRzLlxyXG4gICAgICAgICAqIEBkZWZhdWx0IDMwMDAwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWF4RGVsYXlNcz86IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWF4aW11bSBudW1iZXIgb2YgcmVjb25uZWN0aW9uIGF0dGVtcHRzIGJlZm9yZSBnaXZpbmcgdXAuXHJcbiAgICAgICAgICogT21pdCBmb3IgdW5saW1pdGVkIGF0dGVtcHRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1heEF0dGVtcHRzPzogbnVtYmVyO1xyXG4gICAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZsdWVudCBidWlsZGVyIGZvciBjb25zdHJ1Y3RpbmcgYW4ge0BsaW5rIElNY3BTZXJ2ZXJ9LlxyXG4gKlxyXG4gKiBDYWxsIHtAbGluayB3aXRoQmVoYXZpb3J9IG9uY2UgcGVyIGJlaGF2aW9yIHR5cGUgeW91IHdhbnQgdG8gc3VwcG9ydC5cclxuICogQWZ0ZXIge0BsaW5rIGJ1aWxkfSwgdXNlIHtAbGluayBJTWNwU2VydmVyLmF0dGFjaH0gdG8gcmVnaXN0ZXIgbGl2ZSBvYmplY3QgaW5zdGFuY2VzLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIGNvbnN0IHNlcnZlciA9IGJ1aWxkZXJcclxuICogICAgIC53aXRoTmFtZShcImJhYnlsb24tc2NlbmVcIilcclxuICogICAgIC53aXRoV3NVcmwoXCJ3czovL2xvY2FsaG9zdDo4MDgwXCIpXHJcbiAqICAgICAud2l0aEluaXRpYWxpemVyKG5ldyBTY2VuZUluaXRpYWxpemVyKCkpXHJcbiAqICAgICAud2l0aEJlaGF2aW9yKG5ldyBNZXNoQmVoYXZpb3IoKSlcclxuICogICAgIC53aXRoQmVoYXZpb3IobmV3IExpZ2h0QmVoYXZpb3IoKSlcclxuICogICAgIC53aXRoT3B0aW9ucyh7IGlkbGVUaW1lb3V0TXM6IDMwXzAwMCB9KVxyXG4gKiAgICAgLmJ1aWxkKCk7XHJcbiAqXHJcbiAqIGF3YWl0IHNlcnZlci5zdGFydCgpO1xyXG4gKiBzZXJ2ZXIuYXR0YWNoKGhlcm9NZXNoLCBtZXNoQmVoYXZpb3IpO1xyXG4gKiBzZXJ2ZXIuYXR0YWNoKHN1bkxpZ2h0LCBsaWdodEJlaGF2aW9yKTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNY3BTZXJ2ZXJCdWlsZGVyIHtcclxuICAgIHdpdGhXc1VybCh1cmw6IHN0cmluZyk6IElNY3BTZXJ2ZXJCdWlsZGVyO1xyXG4gICAgd2l0aE5hbWUobmFtZTogc3RyaW5nKTogSU1jcFNlcnZlckJ1aWxkZXI7XHJcbiAgICB3aXRoSW5pdGlhbGl6ZXIoaW5pdGlhbGl6ZXI6IElNY3BJbml0aWFsaXplcik6IElNY3BTZXJ2ZXJCdWlsZGVyO1xyXG4gICAgd2l0aEJlaGF2aW9yPFQ+KC4uLmJlaGF2aW9yOiBJTWNwQmVoYXZpb3I8VD5bXSk6IElNY3BTZXJ2ZXJCdWlsZGVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXBsYWNlcyB0aGUgZGVmYXVsdCBKU09OLVJQQyBtZXNzYWdlIHJvdXRpbmcgd2l0aCBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAqIFdoZW4gb21pdHRlZCwge0BsaW5rIE1jcFNlcnZlcn0gaGFuZGxlcyByb3V0aW5nIGl0c2VsZi5cclxuICAgICAqIFVzZSB0aGlzIHRvIGludGVyY2VwdCwgb3ZlcnJpZGUsIG9yIGV4dGVuZCBpbmRpdmlkdWFsIE1DUCBtZXRob2QgaGFuZGxlcnMuXHJcbiAgICAgKi9cclxuICAgIHdpdGhIYW5kbGVycyhoYW5kbGVyczogSU1jcFNlcnZlckhhbmRsZXJzKTogSU1jcFNlcnZlckJ1aWxkZXI7XHJcbiAgICB3aXRoT3B0aW9ucyhvOiBJTWNwU2VydmVyT3B0aW9ucyk6IElNY3BTZXJ2ZXJCdWlsZGVyO1xyXG4gICAgYnVpbGQoKTogSU1jcFNlcnZlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgcnVubmluZyBNQ1Agc2VydmVyIHRoYXQgYWN0cyBhcyBhbiBhZ2dyZWdhdGluZyBwcm94eSBvdmVyIHJlZ2lzdGVyZWQgYmVoYXZpb3JzLlxyXG4gKlxyXG4gKiBSZXNvdXJjZXMgYW5kIHRvb2xzIGV4cG9zZWQgdG8gdGhlIGNsaWVudCBhcmUgdGhlIHVuaW9uIG9mIGFsbFxyXG4gKiB7QGxpbmsgSU1jcEJlaGF2aW9ySW5zdGFuY2V9cyBjdXJyZW50bHkgYXR0YWNoZWQgdG8gdGhlIHNlcnZlci5cclxuICogQmVoYXZpb3JzIGFuZCBpbnN0YW5jZXMgY2FuIGJlIGFkZGVkIG9yIHJlbW92ZWQgYXQgYW55IHRpbWUsIGV2ZW4gd2hpbGUgcnVubmluZy5cclxuICpcclxuICogT2J0YWluZWQgdmlhIHtAbGluayBJTWNwU2VydmVyQnVpbGRlci5idWlsZH0uXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNY3BTZXJ2ZXIge1xyXG4gICAgLyoqIEh1bWFuLXJlYWRhYmxlIG5hbWUgb2YgdGhpcyBzZXJ2ZXIgaW5zdGFuY2UuICovXHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFdoZXRoZXIgdGhlIHNlcnZlciBpcyBjdXJyZW50bHkgcnVubmluZyBhbmQgYWNjZXB0aW5nIGNvbm5lY3Rpb25zLiAqL1xyXG4gICAgcmVhZG9ubHkgaXNSdW5uaW5nOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBTdGFydHMgdGhlIHNlcnZlciBhbmQgYmVnaW5zIGFjY2VwdGluZyBjbGllbnQgY29ubmVjdGlvbnMuICovXHJcbiAgICBzdGFydCgpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAgIC8qKiBHcmFjZWZ1bGx5IHN0b3BzIHRoZSBzZXJ2ZXIgYW5kIGNsb3NlcyBhbGwgYWN0aXZlIGNvbm5lY3Rpb25zLiAqL1xyXG4gICAgc3RvcCgpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXJzIGEgYmVoYXZpb3IgdHlwZSB3aXRoIHRoZSBzZXJ2ZXIuXHJcbiAgICAgKiBNdXN0IGJlIGNhbGxlZCBiZWZvcmUge0BsaW5rIGF0dGFjaH0gY2FuIGJlIHVzZWQgd2l0aCB0aGlzIGJlaGF2aW9yLlxyXG4gICAgICogU2FmZSB0byBjYWxsIHdoaWxlIHRoZSBzZXJ2ZXIgaXMgcnVubmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmVoYXZpb3IgLSBUaGUgYmVoYXZpb3IgdHlwZSB0byByZWdpc3Rlci5cclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJCZWhhdmlvcjxUPihiZWhhdmlvcjogSU1jcEJlaGF2aW9yPFQ+KTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIGEgc3BlY2lmaWMgb2JqZWN0IGluc3RhbmNlIHRvIGEgcmVnaXN0ZXJlZCBiZWhhdmlvcixcclxuICAgICAqIG1ha2luZyBpdCB2aXNpYmxlIHRvIHRoZSBNQ1AgY2xpZW50IGFzIGEgcmVzb3VyY2Ugd2l0aCB0b29scy5cclxuICAgICAqIFNhZmUgdG8gY2FsbCB3aGlsZSB0aGUgc2VydmVyIGlzIHJ1bm5pbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBvYmplY3QgdG8gZXhwb3NlIChlLmcuIGEgQmFieWxvbi5qcyBgTWVzaGAgb3IgYExpZ2h0YCkuXHJcbiAgICAgKiBAcGFyYW0gYmVoYXZpb3IgLSBUaGUgcmVnaXN0ZXJlZCBiZWhhdmlvciB0aGF0IGtub3dzIGhvdyB0byB3cmFwIGB0YXJnZXRgLlxyXG4gICAgICogQHJldHVybnMgVGhlIGNyZWF0ZWQge0BsaW5rIElNY3BCZWhhdmlvckluc3RhbmNlfSwgdXNlZnVsIGZvciBsYXRlciBkZXRhY2hpbmcuXHJcbiAgICAgKi9cclxuICAgIGF0dGFjaDxUPih0YXJnZXQ6IFQsIGJlaGF2aW9yOiBJTWNwQmVoYXZpb3I8VD4pOiBJTWNwQmVoYXZpb3JJbnN0YW5jZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYSBwcmV2aW91c2x5IGF0dGFjaGVkIGluc3RhbmNlIGZyb20gdGhlIHNlcnZlciBieSBpdHMgVVJJLlxyXG4gICAgICogVGhlIHJlc291cmNlIGFuZCBpdHMgdG9vbHMgd2lsbCBubyBsb25nZXIgYmUgdmlzaWJsZSB0byB0aGUgY2xpZW50LlxyXG4gICAgICogU2FmZSB0byBjYWxsIHdoaWxlIHRoZSBzZXJ2ZXIgaXMgcnVubmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXJpIC0gVGhlIFVSSSBvZiB0aGUgaW5zdGFuY2UgdG8gcmVtb3ZlIChmcm9tIHtAbGluayBJTWNwQmVoYXZpb3JJbnN0YW5jZS51cml9KS5cclxuICAgICAqL1xyXG4gICAgZGV0YWNoKHVyaTogc3RyaW5nKTogdm9pZDtcclxufVxyXG4iLCJleHBvcnQgeyBNY3BTZXJ2ZXIgfSBmcm9tIFwiLi9tY3Auc2VydmVyXCI7XG5leHBvcnQgeyBNY3BTZXJ2ZXJCdWlsZGVyIH0gZnJvbSBcIi4vbWNwLnNlcnZlci5idWlsZGVyXCI7XG5leHBvcnQgeyBqc29uUnBjT2ssIGpzb25ScGNFcnJvciwgTWNwIH0gZnJvbSBcIi4vanNvbnJwYy5oZWxwZXJzXCI7XG4iLCJpbXBvcnQgdHlwZSB7IEpzb25ScGNFcnJvciwgSnNvblJwY1Jlc3BvbnNlLCBNY3BJbml0aWFsaXplUmVzdWx0LCBNY3BSZXNvdXJjZSwgTWNwUmVzb3VyY2VDb250ZW50LCBNY3BSZXNvdXJjZVRlbXBsYXRlLCBNY3BUb29sIH0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHZW5lcmljIEpTT04tUlBDIDIuMCBidWlsZGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQnVpbGRzIGEgc3VjY2Vzc2Z1bCBKU09OLVJQQyAyLjAgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIGlkICAgICAtIFRoZSByZXF1ZXN0IGlkIHRvIGVjaG8gYmFjay5cbiAqIEBwYXJhbSByZXN1bHQgLSBUaGUgcmVzdWx0IHBheWxvYWQuIE1heSBiZSBhbnkgc2VyaWFsaXphYmxlIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblJwY09rKGlkOiBzdHJpbmcgfCBudW1iZXIsIHJlc3VsdDogdW5rbm93bik6IEpzb25ScGNSZXNwb25zZSB7XG4gICAgcmV0dXJuIHsganNvbnJwYzogXCIyLjBcIiwgaWQsIHJlc3VsdCB9O1xufVxuXG4vKipcbiAqIEJ1aWxkcyBhIEpTT04tUlBDIDIuMCBlcnJvciByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0gaWQgICAgICAtIFRoZSByZXF1ZXN0IGlkIHRvIGVjaG8gYmFjaywgb3IgYG51bGxgIGZvciBwYXJzZSBlcnJvcnMgd2hlcmVcbiAqICAgICAgICAgICAgICAgICAgdGhlIGlkIGNvdWxkIG5vdCBiZSBkZXRlcm1pbmVkIChjYXN0IHJlcXVpcmVkIGJ5IHRoZSBpbnRlcmZhY2UpLlxuICogQHBhcmFtIGNvZGUgICAgLSBOdW1lcmljIGVycm9yIGNvZGUuIFN0YW5kYXJkIHJhbmdlczogLTMyNzY4IHRvIC0zMjAwMCBhcmUgcmVzZXJ2ZWQuXG4gKiBAcGFyYW0gbWVzc2FnZSAtIEh1bWFuLXJlYWRhYmxlIGVycm9yIGRlc2NyaXB0aW9uLlxuICogQHBhcmFtIGRhdGEgICAgLSBPcHRpb25hbCBhZGRpdGlvbmFsIGRpYWdub3N0aWMgZGF0YS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGpzb25ScGNFcnJvcihpZDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCwgY29kZTogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcsIGRhdGE/OiB1bmtub3duKTogSnNvblJwY1Jlc3BvbnNlIHtcbiAgICBjb25zdCBlcnJvcjogSnNvblJwY0Vycm9yID0gZGF0YSAhPT0gdW5kZWZpbmVkID8geyBjb2RlLCBtZXNzYWdlLCBkYXRhIH0gOiB7IGNvZGUsIG1lc3NhZ2UgfTtcbiAgICAvLyBpZCBpcyBudWxsIGZvciBwYXJzZSBlcnJvcnMgcGVyIHRoZSBKU09OLVJQQyAyLjAgc3BlYzsgdGhlIGludGVyZmFjZVxuICAgIC8vIGRvZXMgbm90IG1vZGVsIG51bGwgaGVyZSwgc28gYSBjYXN0IGlzIHJlcXVpcmVkLlxuICAgIHJldHVybiB7IGpzb25ycGM6IFwiMi4wXCIsIGlkOiBpZCBhcyBzdHJpbmcgfCBudW1iZXIsIGVycm9yIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTUNQLXNwZWNpZmljIGhlbHBlcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIE5hbWVkIGhlbHBlcnMgZm9yIHRoZSBNQ1AgcHJvdG9jb2wsIGJ1aWx0IG9uIHRvcCBvZiB0aGUgZ2VuZXJpYyBKU09OLVJQQyBidWlsZGVycy5cbiAqXG4gKiAqKkVycm9yIGJ1aWxkZXJzKiogdXNlIHN0YW5kYXJkIEpTT04tUlBDIC8gTUNQIGVycm9yIGNvZGVzIHNvIGNhbGxlcnMgbmV2ZXJcbiAqIGhhdmUgdG8gcmVtZW1iZXIgbWFnaWMgbnVtYmVycy5cbiAqXG4gKiAqKlJlc3VsdCBidWlsZGVycyoqIGVuY29kZSB0aGUgZXhhY3Qgd2lyZSBzaGFwZXMgcmVxdWlyZWQgYnkgdGhlIE1DUCBzcGVjIHNvXG4gKiBoYW5kbGVyIGNvZGUgcmVhZHMgYXMgcHVyZSBkb21haW4gbG9naWMsIGZyZWUgb2YgcHJvdG9jb2wgYm9pbGVycGxhdGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIEluc3RlYWQgb2Y6XG4gKiByZXR1cm4geyBqc29ucnBjOiBcIjIuMFwiLCBpZDogcmVxLmlkLCByZXN1bHQ6IHsgY29udGVudDogW3sgdHlwZTogXCJ0ZXh0XCIsIHRleHQ6IFwi4oCmXCIgfV0gfSB9O1xuICpcbiAqIC8vIFdyaXRlOlxuICogcmV0dXJuIE1jcC50b29sQ2FsbFJlc3VsdChyZXEuaWQsIFwi4oCmXCIpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBNY3AgPSB7XG4gICAgLy8g4pSA4pSAIEVycm9ycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKiBgLTMyNzAwYCDigJQgcmVxdWVzdCBib2R5IGNvdWxkIG5vdCBiZSBwYXJzZWQgYXMgSlNPTi4gYGlkYCBpcyBgbnVsbGAgcGVyIHNwZWMuICovXG4gICAgcGFyc2VFcnJvcjogKCk6IEpzb25ScGNSZXNwb25zZSA9PiBqc29uUnBjRXJyb3IobnVsbCwgLTMyNzAwLCBcIlBhcnNlIGVycm9yXCIpLFxuXG4gICAgLyoqIGAtMzI2MDFgIOKAlCB0aGUgcmVxdWVzdGVkIG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiB0aGlzIHNlcnZlci4gKi9cbiAgICBtZXRob2ROb3RGb3VuZDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIG1ldGhvZDogc3RyaW5nKTogSnNvblJwY1Jlc3BvbnNlID0+IGpzb25ScGNFcnJvcihpZCwgLTMyNjAxLCBgTWV0aG9kIG5vdCBmb3VuZDogJHttZXRob2R9YCksXG5cbiAgICAvKiogYC0zMjYwMmAg4oCUIHJlcXVpcmVkIHBhcmFtZXRlcnMgYXJlIG1pc3Npbmcgb3IgbWFsZm9ybWVkLiAqL1xuICAgIGludmFsaWRQYXJhbXM6IChpZDogc3RyaW5nIHwgbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpOiBKc29uUnBjUmVzcG9uc2UgPT4ganNvblJwY0Vycm9yKGlkLCAtMzI2MDIsIG1lc3NhZ2UpLFxuXG4gICAgLyoqIGAtMzI2MDNgIOKAlCBhbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkIHdoaWxlIHByb2Nlc3NpbmcgdGhlIHJlcXVlc3QuICovXG4gICAgaW50ZXJuYWxFcnJvcjogKGlkOiBzdHJpbmcgfCBudW1iZXIsIG1lc3NhZ2U6IHN0cmluZyk6IEpzb25ScGNSZXNwb25zZSA9PiBqc29uUnBjRXJyb3IoaWQsIC0zMjYwMywgbWVzc2FnZSksXG5cbiAgICAvKiogYC0zMjAwMmAg4oCUIG5vIHJlc291cmNlIG1hdGNoZWQgdGhlIGdpdmVuIFVSSS4gKi9cbiAgICByZXNvdXJjZU5vdEZvdW5kOiAoaWQ6IHN0cmluZyB8IG51bWJlciwgdXJpOiBzdHJpbmcpOiBKc29uUnBjUmVzcG9uc2UgPT4ganNvblJwY0Vycm9yKGlkLCAtMzIwMDIsIGBSZXNvdXJjZSBub3QgZm91bmQ6ICR7dXJpfWApLFxuXG4gICAgLyoqIGAtMzIwMDJgIOKAlCBubyBhdHRhY2hlZCBiZWhhdmlvciBpbnN0YW5jZSBtYXRjaGVkIHRoZSBnaXZlbiBVUkkuICovXG4gICAgaW5zdGFuY2VOb3RGb3VuZDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVyaTogc3RyaW5nKTogSnNvblJwY1Jlc3BvbnNlID0+IGpzb25ScGNFcnJvcihpZCwgLTMyMDAyLCBgSW5zdGFuY2Ugbm90IGZvdW5kOiAke3VyaX1gKSxcblxuICAgIC8qKiBgLTMyNjAxYCDigJQgbm8gdG9vbCBtYXRjaGVkIHRoZSBnaXZlbiBuYW1lLiAqL1xuICAgIHRvb2xOb3RGb3VuZDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIG5hbWU6IHN0cmluZyk6IEpzb25ScGNSZXNwb25zZSA9PiBqc29uUnBjRXJyb3IoaWQsIC0zMjYwMSwgYFRvb2wgbm90IGZvdW5kOiAke25hbWV9YCksXG5cbiAgICAvLyDilIDilIAgUmVzdWx0cyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKiBXcmFwcyBhbiBgaW5pdGlhbGl6ZWAgcmVzdWx0LiAqL1xuICAgIGluaXRpYWxpemVSZXN1bHQ6IChpZDogc3RyaW5nIHwgbnVtYmVyLCByZXN1bHQ6IE1jcEluaXRpYWxpemVSZXN1bHQpOiBKc29uUnBjUmVzcG9uc2UgPT4ganNvblJwY09rKGlkLCByZXN1bHQpLFxuXG4gICAgLyoqIFdyYXBzIGEgYHJlc291cmNlcy9saXN0YCByZXN1bHQuICovXG4gICAgcmVzb3VyY2VzTGlzdFJlc3VsdDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIHJlc291cmNlczogTWNwUmVzb3VyY2VbXSk6IEpzb25ScGNSZXNwb25zZSA9PiBqc29uUnBjT2soaWQsIHsgcmVzb3VyY2VzIH0pLFxuXG4gICAgLyoqIFdyYXBzIGEgYHJlc291cmNlcy90ZW1wbGF0ZXMvbGlzdGAgcmVzdWx0LiAqL1xuICAgIHJlc291cmNlc1RlbXBsYXRlc0xpc3RSZXN1bHQ6IChpZDogc3RyaW5nIHwgbnVtYmVyLCByZXNvdXJjZVRlbXBsYXRlczogTWNwUmVzb3VyY2VUZW1wbGF0ZVtdKTogSnNvblJwY1Jlc3BvbnNlID0+IGpzb25ScGNPayhpZCwgeyByZXNvdXJjZVRlbXBsYXRlcyB9KSxcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGEgYHJlc291cmNlcy9yZWFkYCByZXN1bHQuXG4gICAgICogVGhlIE1DUCBzcGVjIHdyYXBzIGNvbnRlbnQgaW4gYW4gYXJyYXkgKGBjb250ZW50c2ApIHRvIGFsbG93IGZ1dHVyZSBtdWx0aS1wYXJ0IHJlYWRzLlxuICAgICAqL1xuICAgIHJlc291cmNlc1JlYWRSZXN1bHQ6IChpZDogc3RyaW5nIHwgbnVtYmVyLCBjb250ZW50OiBNY3BSZXNvdXJjZUNvbnRlbnQpOiBKc29uUnBjUmVzcG9uc2UgPT4ganNvblJwY09rKGlkLCB7IGNvbnRlbnRzOiBbY29udGVudF0gfSksXG5cbiAgICAvKiogV3JhcHMgYSBgdG9vbHMvbGlzdGAgcmVzdWx0LiAqL1xuICAgIHRvb2xzTGlzdFJlc3VsdDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIHRvb2xzOiBNY3BUb29sW10pOiBKc29uUnBjUmVzcG9uc2UgPT4ganNvblJwY09rKGlkLCB7IHRvb2xzIH0pLFxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBgdG9vbHMvY2FsbGAgcmVzdWx0IGFzIGEgc2luZ2xlIHRleHQgY29udGVudCBibG9jay5cbiAgICAgKiBQYXNzIGEgcHJlLXNlcmlhbGl6ZWQgSlNPTiBzdHJpbmcgZm9yIHN0cnVjdHVyZWQgZGF0YS5cbiAgICAgKi9cbiAgICB0b29sQ2FsbFJlc3VsdDogKGlkOiBzdHJpbmcgfCBudW1iZXIsIHRleHQ6IHN0cmluZyk6IEpzb25ScGNSZXNwb25zZSA9PiBqc29uUnBjT2soaWQsIHsgY29udGVudDogW3sgdHlwZTogXCJ0ZXh0XCIsIHRleHQgfV0gfSksXG59IGFzIGNvbnN0O1xuIiwiaW1wb3J0IHR5cGUgeyBJTWNwQmVoYXZpb3IsIElNY3BJbml0aWFsaXplciwgSU1jcFNlcnZlciwgSU1jcFNlcnZlckJ1aWxkZXIsIElNY3BTZXJ2ZXJIYW5kbGVycywgSU1jcFNlcnZlck9wdGlvbnMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgTWNwU2VydmVyIH0gZnJvbSBcIi4vbWNwLnNlcnZlclwiO1xuXG4vKipcbiAqIEZsdWVudCBidWlsZGVyIHRoYXQgY29uc3RydWN0cyBhIGNvbmZpZ3VyZWQge0BsaW5rIE1jcFNlcnZlcn0uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGNvbnN0IHNlcnZlciA9IG5ldyBNY3BTZXJ2ZXJCdWlsZGVyKClcbiAqICAgICAud2l0aE5hbWUoXCJiYWJ5bG9uLXNjZW5lXCIpXG4gKiAgICAgLndpdGhXc1VybChcIndzOi8vbG9jYWxob3N0OjgwODBcIilcbiAqICAgICAud2l0aEluaXRpYWxpemVyKG5ldyBTY2VuZUluaXRpYWxpemVyKCkpXG4gKiAgICAgLndpdGhCZWhhdmlvcihuZXcgTWVzaEJlaGF2aW9yKCksIG5ldyBMaWdodEJlaGF2aW9yKCkpXG4gKiAgICAgLndpdGhPcHRpb25zKHsgaWRsZVRpbWVvdXRNczogMzBfMDAwLCByZWNvbm5lY3Q6IHsgYmFzZURlbGF5TXM6IDFfMDAwLCBtYXhEZWxheU1zOiAzMF8wMDAgfSB9KVxuICogICAgIC5idWlsZCgpO1xuICpcbiAqIGF3YWl0IHNlcnZlci5zdGFydCgpO1xuICogc2VydmVyLmF0dGFjaChoZXJvTWVzaCwgbWVzaEJlaGF2aW9yKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgTWNwU2VydmVyQnVpbGRlciBpbXBsZW1lbnRzIElNY3BTZXJ2ZXJCdWlsZGVyIHtcbiAgICBwcml2YXRlIF9uYW1lID0gXCJtY3Atc2VydmVyXCI7XG4gICAgcHJpdmF0ZSBfd3NVcmwgPSBcIlwiO1xuICAgIHByaXZhdGUgX2luaXRpYWxpemVyOiBJTWNwSW5pdGlhbGl6ZXIgfCB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBfaGFuZGxlcnM6IElNY3BTZXJ2ZXJIYW5kbGVycyB8IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIF9iZWhhdmlvcnM6IElNY3BCZWhhdmlvcjx1bmtub3duPltdID0gW107XG4gICAgcHJpdmF0ZSBfb3B0aW9uczogSU1jcFNlcnZlck9wdGlvbnMgPSB7fTtcblxuICAgIC8qKiBTZXRzIHRoZSBodW1hbi1yZWFkYWJsZSBuYW1lIHJlcG9ydGVkIGluIGBpbml0aWFsaXplYCByZXNwb25zZXMuICovXG4gICAgd2l0aE5hbWUobmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKiogU2V0cyB0aGUgV2ViU29ja2V0IHR1bm5lbCBVUkwgdGhlIHNlcnZlciB3aWxsIGNvbm5lY3QgdG8gb24ge0BsaW5rIElNY3BTZXJ2ZXIuc3RhcnR9LiAqL1xuICAgIHdpdGhXc1VybCh1cmw6IHN0cmluZyk6IHRoaXMge1xuICAgICAgICB0aGlzLl93c1VybCA9IHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZXMgdGhlIGRvbWFpbi1sZXZlbCBpbml0aWFsaXplciB0aGF0IHN1cHBsaWVzIHNlcnZlciBpZGVudGl0eSBhbmRcbiAgICAgKiBwcm90b2NvbCB2ZXJzaW9uIGR1cmluZyB0aGUgTUNQIGhhbmRzaGFrZS5cbiAgICAgKiBJZiBvbWl0dGVkLCB0aGUgc2VydmVyIHVzZXMgYnVpbHQtaW4gZGVmYXVsdHMuXG4gICAgICovXG4gICAgd2l0aEluaXRpYWxpemVyKGluaXRpYWxpemVyOiBJTWNwSW5pdGlhbGl6ZXIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZXIgPSBpbml0aWFsaXplcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIG9uZSBvciBtb3JlIGJlaGF2aW9yIHR5cGVzLlxuICAgICAqIEFjY2VwdHMgbXVsdGlwbGUgYmVoYXZpb3JzIGluIGEgc2luZ2xlIGNhbGwgZm9yIGNvbnZlbmllbmNlLlxuICAgICAqIEJlaGF2aW9ycyBjb250cmlidXRlIHRvIHRoZSBhZHZlcnRpc2VkIGNhcGFiaWxpdGllcyBhbmQgZW5hYmxlIHtAbGluayBJTWNwU2VydmVyLmF0dGFjaH0uXG4gICAgICovXG4gICAgd2l0aEJlaGF2aW9yPFQ+KC4uLmJlaGF2aW9yOiBJTWNwQmVoYXZpb3I8VD5bXSk6IHRoaXMge1xuICAgICAgICB0aGlzLl9iZWhhdmlvcnMucHVzaCguLi4oYmVoYXZpb3IgYXMgSU1jcEJlaGF2aW9yPHVua25vd24+W10pKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVwbGFjZXMgdGhlIGRlZmF1bHQgSlNPTi1SUEMgbWVzc2FnZSByb3V0aW5nIHdpdGggYSBjdXN0b20gaGFuZGxlciBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKiBXaGVuIG9taXR0ZWQsIHtAbGluayBNY3BTZXJ2ZXJ9IGhhbmRsZXMgcm91dGluZyBpdHNlbGYgdXNpbmcgaXRzIGJ1aWx0LWluIGxvZ2ljLlxuICAgICAqXG4gICAgICogVXNlIHRoaXMgdG8gaW50ZXJjZXB0IHNwZWNpZmljIE1DUCBtZXRob2RzLCBhZGQgbG9nZ2luZywgb3IgZGVsZWdhdGUgdG8gYVxuICAgICAqIGNvbXBsZXRlbHkgZGlmZmVyZW50IHJvdXRpbmcgc3RyYXRlZ3kuXG4gICAgICovXG4gICAgd2l0aEhhbmRsZXJzKGhhbmRsZXJzOiBJTWNwU2VydmVySGFuZGxlcnMpOiB0aGlzIHtcbiAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIHRoZSBnaXZlbiBvcHRpb25zIHdpdGggYW55IHByZXZpb3VzbHkgc2V0IG9wdGlvbnMuXG4gICAgICogTGF0ZXIgY2FsbHMgb3ZlcnJpZGUgZWFybGllciBvbmVzIGZvciB0aGUgc2FtZSBrZXkuXG4gICAgICovXG4gICAgd2l0aE9wdGlvbnMobzogSU1jcFNlcnZlck9wdGlvbnMpOiB0aGlzIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHsgLi4udGhpcy5fb3B0aW9ucywgLi4ubyB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGFuZCByZXR1cm5zIGEgY29uZmlndXJlZCB7QGxpbmsgSU1jcFNlcnZlcn0uXG4gICAgICogQHRocm93cyB7RXJyb3J9IGlmIGB3aXRoV3NVcmwoKWAgd2FzIG5vdCBjYWxsZWQuXG4gICAgICovXG4gICAgYnVpbGQoKTogSU1jcFNlcnZlciB7XG4gICAgICAgIGlmICghdGhpcy5fd3NVcmwpIHRocm93IG5ldyBFcnJvcihcIk1jcFNlcnZlckJ1aWxkZXI6IHdpdGhXc1VybCgpIGlzIHJlcXVpcmVkIGJlZm9yZSBidWlsZCgpXCIpO1xuXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBNY3BTZXJ2ZXIodGhpcy5fbmFtZSwgdGhpcy5fd3NVcmwsIHRoaXMuX29wdGlvbnMsIHRoaXMuX2luaXRpYWxpemVyLCB0aGlzLl9oYW5kbGVycyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBiZWhhdmlvciBvZiB0aGlzLl9iZWhhdmlvcnMpIHtcbiAgICAgICAgICAgIHNlcnZlci5yZWdpc3RlckJlaGF2aW9yKGJlaGF2aW9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXJ2ZXI7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBJTWNwQmVoYXZpb3IsIElNY3BCZWhhdmlvckluc3RhbmNlLCBJTWNwSW5pdGlhbGl6ZXIsIElNY3BTZXJ2ZXIsIElNY3BTZXJ2ZXJIYW5kbGVycywgSU1jcFNlcnZlck9wdGlvbnMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIEpzb25ScGNOb3RpZmljYXRpb24sXG4gICAgSnNvblJwY1JlcXVlc3QsXG4gICAgSnNvblJwY1Jlc3BvbnNlLFxuICAgIE1jcENsaWVudENhcGFiaWxpdGllcyxcbiAgICBNY3BDbGllbnRJbmZvLFxuICAgIE1jcEluaXRpYWxpemVSZXN1bHQsXG4gICAgTWNwUmVzb3VyY2VUZW1wbGF0ZSxcbiAgICBNY3BTZXJ2ZXJDYXBhYmlsaXRpZXMsXG4gICAgTWNwVG9vbCxcbn0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IE1jcCB9IGZyb20gXCIuL2pzb25ycGMuaGVscGVyc1wiO1xuXG4vKipcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIElNY3BTZXJ2ZXJ9LlxuICpcbiAqIENvbm5lY3RzIHRvIGEgV2ViU29ja2V0IHR1bm5lbCBhbmQgcm91dGVzIGluY29taW5nIEpTT04tUlBDIG1lc3NhZ2VzIHRvIHRoZVxuICogYXBwcm9wcmlhdGUgTUNQIGhhbmRsZXIuIEFsc28gaW1wbGVtZW50cyB7QGxpbmsgSU1jcFNlcnZlckhhbmRsZXJzfSBzbyBpdCBjYW5cbiAqIGFjdCBhcyBpdHMgb3duIGRlZmF1bHQgaGFuZGxlciDigJQgb3IgZGVsZWdhdGUgdG8gYSBjdXN0b20gb25lIHN1cHBsaWVkIHZpYSB0aGVcbiAqIGJ1aWxkZXIncyBgd2l0aEhhbmRsZXJzKClgLlxuICpcbiAqIExpZmVjeWNsZTpcbiAqIGBgYFxuICogc3RhcnQoKSDihpIgV2ViU29ja2V0IG9wZW5zIOKGkiByZWNlaXZlcyBtZXNzYWdlcyDihpIgZGlzcGF0Y2hlcyB0byBoYW5kbGVyc1xuICogc3RvcCgpICDihpIgV2ViU29ja2V0IGNsb3NlcywgcmVjb25uZWN0aW9uIGNhbmNlbGxlZFxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBNY3BTZXJ2ZXIgaW1wbGVtZW50cyBJTWNwU2VydmVyLCBJTWNwU2VydmVySGFuZGxlcnMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHJlYWRvbmx5IF93c1VybDogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnM6IElNY3BTZXJ2ZXJPcHRpb25zO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luaXRpYWxpemVyOiBJTWNwSW5pdGlhbGl6ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWN0aXZlIG1lc3NhZ2UgaGFuZGxlci4gRGVmYXVsdHMgdG8gYHRoaXNgIChzZWxmLXJvdXRpbmcpLlxuICAgICAqIENhbiBiZSByZXBsYWNlZCBieSBhIGN1c3RvbSB7QGxpbmsgSU1jcFNlcnZlckhhbmRsZXJzfSB2aWEgdGhlIGJ1aWxkZXIuXG4gICAgICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBfaGFuZGxlcnM6IElNY3BTZXJ2ZXJIYW5kbGVycztcblxuICAgIHByaXZhdGUgX3dzOiBXZWJTb2NrZXQgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIF9pc1J1bm5pbmcgPSBmYWxzZTtcblxuICAgIC8qKiBTZXQgdG8gdHJ1ZSBieSB7QGxpbmsgc3RvcH0gdG8gcHJldmVudCByZWNvbm5lY3Rpb24gYWZ0ZXIgYW4gZXhwbGljaXQgY2xvc2UuICovXG4gICAgcHJpdmF0ZSBfc3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRvIHRydWUgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGBub3RpZmljYXRpb25zL2luaXRpYWxpemVkYCwgc2lnbmFsbGluZyB0aGF0XG4gICAgICogdGhlIHNlc3Npb24gaGFuZHNoYWtlIGlzIGNvbXBsZXRlIGFuZCB0aGUgY2xpZW50IGlzIHJlYWR5IHRvIGlzc3VlIHJlcXVlc3RzLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3Nlc3Npb25SZWFkeSA9IGZhbHNlO1xuXG4gICAgLyoqIENvdW50cyBjb25zZWN1dGl2ZSBmYWlsZWQgcmVjb25uZWN0aW9uIGF0dGVtcHRzOyByZXNldCBvbiBzdWNjZXNzZnVsIG9wZW4uICovXG4gICAgcHJpdmF0ZSBfcmVjb25uZWN0QXR0ZW1wdHMgPSAwO1xuXG4gICAgLyoqIEhhbmRsZSBmb3IgdGhlIHBlbmRpbmcgaWRsZS10aW1lb3V0IHRpbWVyLCBpZiBhY3RpdmUuICovXG4gICAgcHJpdmF0ZSBfaWRsZVRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuXG4gICAgLyoqIFJlZ2lzdGVyZWQgYmVoYXZpb3IgdHlwZXMsIGtleWVkIGJ5IG5hbWVzcGFjZS4gKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iZWhhdmlvcnMgPSBuZXcgTWFwPHN0cmluZywgSU1jcEJlaGF2aW9yPHVua25vd24+PigpO1xuXG4gICAgLyoqIExpdmUgb2JqZWN0IGluc3RhbmNlcywga2V5ZWQgYnkgVVJJLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luc3RhbmNlcyA9IG5ldyBNYXA8c3RyaW5nLCBJTWNwQmVoYXZpb3JJbnN0YW5jZT4oKTtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgd3NVcmw6IHN0cmluZywgb3B0aW9uczogSU1jcFNlcnZlck9wdGlvbnMsIGluaXRpYWxpemVyPzogSU1jcEluaXRpYWxpemVyLCBoYW5kbGVycz86IElNY3BTZXJ2ZXJIYW5kbGVycykge1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fd3NVcmwgPSB3c1VybDtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVyID0gaW5pdGlhbGl6ZXI7XG4gICAgICAgIC8vIElmIG5vIGN1c3RvbSBoYW5kbGVycyBwcm92aWRlZCwgdGhlIHNlcnZlciByb3V0ZXMgbWVzc2FnZXMgaXRzZWxmLlxuICAgICAgICB0aGlzLl9oYW5kbGVycyA9IGhhbmRsZXJzID8/IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElNY3BTZXJ2ZXIg4oCUIGlkZW50aXR5ICYgc3RhdGVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBnZXQgaXNSdW5uaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNSdW5uaW5nO1xuICAgIH1cblxuICAgIGdldCBpc1Nlc3Npb25SZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nlc3Npb25SZWFkeTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU1jcFNlcnZlciDigJQgbGlmZWN5Y2xlXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uIHRvIHRoZSB0dW5uZWwgVVJMLlxuICAgICAqIFJlc29sdmVzIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQsIHJlamVjdHMgb24gdGhlIGZpcnN0IGVycm9yLlxuICAgICAqIFNhZmUgdG8gY2FsbCBhZ2FpbiBhZnRlciB7QGxpbmsgc3RvcH0gdG8gcmVjb25uZWN0IG1hbnVhbGx5LlxuICAgICAqL1xuICAgIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLl9zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdEF0dGVtcHRzID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uIGFuZCBjYW5jZWxzIGFueSBwZW5kaW5nIHJlY29ubmVjdGlvbi5cbiAgICAgKiBBZnRlciBjYWxsaW5nIHRoaXMsIG5vIGZ1cnRoZXIgcmVjb25uZWN0aW9uIGF0dGVtcHRzIHdpbGwgYmUgbWFkZSB1bnRpbFxuICAgICAqIHtAbGluayBzdGFydH0gaXMgY2FsbGVkIGFnYWluLlxuICAgICAqL1xuICAgIGFzeW5jIHN0b3AoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuX3N0b3BwZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jbGVhcklkbGVUaW1lcigpO1xuICAgICAgICB0aGlzLl93cz8uY2xvc2UoKTtcbiAgICAgICAgdGhpcy5fd3MgPSBudWxsO1xuICAgICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU1jcFNlcnZlciDigJQgYmVoYXZpb3IgJiBpbnN0YW5jZSBtYW5hZ2VtZW50XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgYmVoYXZpb3IgdHlwZSB3aXRoIHRoZSBzZXJ2ZXIgc28gdGhhdCBpbnN0YW5jZXMgb2YgdGhhdCB0eXBlXG4gICAgICogY2FuIGJlIGF0dGFjaGVkIHZpYSB7QGxpbmsgYXR0YWNofS5cbiAgICAgKiBBbHNvIGNvbnRyaWJ1dGVzIHRvIHRoZSBjYXBhYmlsaXRpZXMgYWR2ZXJ0aXNlZCBkdXJpbmcgYGluaXRpYWxpemVgLlxuICAgICAqL1xuICAgIHJlZ2lzdGVyQmVoYXZpb3I8VD4oYmVoYXZpb3I6IElNY3BCZWhhdmlvcjxUPik6IHZvaWQge1xuICAgICAgICB0aGlzLl9iZWhhdmlvcnMuc2V0KGJlaGF2aW9yLm5hbWVzcGFjZSwgYmVoYXZpb3IgYXMgSU1jcEJlaGF2aW9yPHVua25vd24+KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBgdGFyZ2V0YCB3aXRoIHRoZSBnaXZlbiBiZWhhdmlvciBhbmQgcmVnaXN0ZXJzIHRoZSByZXN1bHRpbmcgaW5zdGFuY2VcbiAgICAgKiBhcyBhIGxpdmUgTUNQIHJlc291cmNlIHdpdGggY2FsbGFibGUgdG9vbHMuXG4gICAgICogU2FmZSB0byBjYWxsIHdoaWxlIHRoZSBzZXJ2ZXIgaXMgcnVubmluZzsgdGhlIGNsaWVudCB3aWxsIHNlZSB0aGUgbmV3IHJlc291cmNlXG4gICAgICogb24gaXRzIG5leHQgYHJlc291cmNlcy9saXN0YCBvciBgdG9vbHMvbGlzdGAgY2FsbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBjcmVhdGVkIGluc3RhbmNlLCB3aG9zZSB7QGxpbmsgSU1jcEJlaGF2aW9ySW5zdGFuY2UudXJpfSBjYW4gYmVcbiAgICAgKiAgICAgICAgICBwYXNzZWQgdG8ge0BsaW5rIGRldGFjaH0gdG8gcmVtb3ZlIGl0IGxhdGVyLlxuICAgICAqL1xuICAgIGF0dGFjaDxUPih0YXJnZXQ6IFQsIGJlaGF2aW9yOiBJTWNwQmVoYXZpb3I8VD4pOiBJTWNwQmVoYXZpb3JJbnN0YW5jZSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gYmVoYXZpb3IuYXR0YWNoKHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlcy5zZXQoaW5zdGFuY2UudXJpLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgcHJldmlvdXNseSBhdHRhY2hlZCBpbnN0YW5jZSBieSBVUkkuXG4gICAgICogVGhlIHJlc291cmNlIGFuZCBpdHMgdG9vbHMgZGlzYXBwZWFyIGZyb20gc3Vic2VxdWVudCBgcmVzb3VyY2VzL2xpc3RgIGFuZFxuICAgICAqIGB0b29scy9saXN0YCByZXNwb25zZXMuXG4gICAgICovXG4gICAgZGV0YWNoKHVyaTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlcy5kZWxldGUodXJpKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU1jcFNlcnZlckhhbmRsZXJzIOKAlCBkZWZhdWx0IE1DUCBtZXRob2QgaW1wbGVtZW50YXRpb25zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB0aGUgYGluaXRpYWxpemVgIGhhbmRzaGFrZS5cbiAgICAgKiBEZWxlZ2F0ZXMgaWRlbnRpdHkvdmVyc2lvbiB0byB7QGxpbmsgSU1jcEluaXRpYWxpemVyfSBpZiBvbmUgd2FzIHByb3ZpZGVkLFxuICAgICAqIHRoZW4gbWVyZ2VzIHdpdGggY2FwYWJpbGl0aWVzIGRlcml2ZWQgZnJvbSByZWdpc3RlcmVkIGJlaGF2aW9ycy5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplKHJlcTogSnNvblJwY1JlcXVlc3QpOiBKc29uUnBjUmVzcG9uc2Uge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSByZXEucGFyYW1zIGFzIHsgY2xpZW50SW5mbz86IE1jcENsaWVudEluZm87IGNhcGFiaWxpdGllcz86IE1jcENsaWVudENhcGFiaWxpdGllcyB9IHwgdW5kZWZpbmVkO1xuXG4gICAgICAgIGNvbnN0IGlkZW50aXR5ID0gdGhpcy5faW5pdGlhbGl6ZXJcbiAgICAgICAgICAgID8gdGhpcy5faW5pdGlhbGl6ZXIuaW5pdGlhbGl6ZShwYXJhbXM/LmNsaWVudEluZm8gPz8geyBuYW1lOiBcInVua25vd25cIiwgdmVyc2lvbjogXCIwLjAuMFwiIH0sIHBhcmFtcz8uY2FwYWJpbGl0aWVzID8/IHt9KVxuICAgICAgICAgICAgOiB7IHByb3RvY29sVmVyc2lvbjogXCIyMDI0LTExLTA1XCIsIHNlcnZlckluZm86IHsgbmFtZTogdGhpcy5fbmFtZSwgdmVyc2lvbjogXCIwLjAuMFwiIH0gfTtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IE1jcEluaXRpYWxpemVSZXN1bHQgPSB7IC4uLmlkZW50aXR5LCBjYXBhYmlsaXRpZXM6IHRoaXMuX2Rlcml2ZUNhcGFiaWxpdGllcygpIH07XG5cbiAgICAgICAgcmV0dXJuIE1jcC5pbml0aWFsaXplUmVzdWx0KHJlcS5pZCwgcmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGByZXNvdXJjZXMvdGVtcGxhdGVzL2xpc3RgLlxuICAgICAqIENvbGxlY3RzIFVSSSB0ZW1wbGF0ZXMgZnJvbSBhbGwgcmVnaXN0ZXJlZCBiZWhhdmlvciB0eXBlcyB0aGF0IGRlY2xhcmUgb25lLlxuICAgICAqIEVhY2ggdW5pcXVlIG5hbWVzcGFjZSBjb250cmlidXRlcyBhdCBtb3N0IG9uZSB0ZW1wbGF0ZSBlbnRyeS5cbiAgICAgKi9cbiAgICByZXNvdXJjZXNUZW1wbGF0ZXNMaXN0KHJlcTogSnNvblJwY1JlcXVlc3QpOiBKc29uUnBjUmVzcG9uc2Uge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZXM6IE1jcFJlc291cmNlVGVtcGxhdGVbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJlaGF2aW9yIG9mIHRoaXMuX2JlaGF2aW9ycy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgaWYgKGJlaGF2aW9yLnVyaVRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB1cmlUZW1wbGF0ZTogIGJlaGF2aW9yLnVyaVRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAgICAgICAgIGJlaGF2aW9yLm5hbWUgICAgICAgID8/IGJlaGF2aW9yLm5hbWVzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICBiZWhhdmlvci5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6ICAgICBiZWhhdmlvci5taW1lVHlwZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWNwLnJlc291cmNlc1RlbXBsYXRlc0xpc3RSZXN1bHQocmVxLmlkLCB0ZW1wbGF0ZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYHJlc291cmNlcy9saXN0YC5cbiAgICAgKiBSZXR1cm5zIHRoZSB1bmlvbiBvZiBhbGwgbGl2ZSB7QGxpbmsgSU1jcEJlaGF2aW9ySW5zdGFuY2V9IHJlc291cmNlcy5cbiAgICAgKi9cbiAgICByZXNvdXJjZXNMaXN0KHJlcTogSnNvblJwY1JlcXVlc3QpOiBKc29uUnBjUmVzcG9uc2Uge1xuICAgICAgICBjb25zdCByZXNvdXJjZXMgPSBBcnJheS5mcm9tKHRoaXMuX2luc3RhbmNlcy52YWx1ZXMoKSkubWFwKChpKSA9PiBpLmdldFJlc291cmNlKCkpO1xuICAgICAgICByZXR1cm4gTWNwLnJlc291cmNlc0xpc3RSZXN1bHQocmVxLmlkLCByZXNvdXJjZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYHJlc291cmNlcy9yZWFkYC5cbiAgICAgKiBMb29rcyB1cCB0aGUgaW5zdGFuY2UgYnkgVVJJIGFuZCByZXR1cm5zIGl0cyBjdXJyZW50IHN0YXRlLlxuICAgICAqIFJldHVybnMgYSBgLTMyMDAyYCBlcnJvciBpZiB0aGUgVVJJIGlzIG5vdCBmb3VuZC5cbiAgICAgKi9cbiAgICBhc3luYyByZXNvdXJjZXNSZWFkKHJlcTogSnNvblJwY1JlcXVlc3QpOiBQcm9taXNlPEpzb25ScGNSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSByZXEucGFyYW1zIGFzIHsgdXJpPzogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHVyaSA9IHBhcmFtcz8udXJpO1xuXG4gICAgICAgIGlmICghdXJpKSByZXR1cm4gTWNwLmludmFsaWRQYXJhbXMocmVxLmlkLCBcIk1pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyOiB1cmlcIik7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5faW5zdGFuY2VzLmdldCh1cmkpO1xuICAgICAgICBpZiAoIWluc3RhbmNlKSByZXR1cm4gTWNwLnJlc291cmNlTm90Rm91bmQocmVxLmlkLCB1cmkpO1xuXG4gICAgICAgIHJldHVybiBNY3AucmVzb3VyY2VzUmVhZFJlc3VsdChyZXEuaWQsIGF3YWl0IGluc3RhbmNlLnJlYWRSZXNvdXJjZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGB0b29scy9saXN0YC5cbiAgICAgKiBEZWR1cGxpY2F0ZXMgdG9vbHMgYnkgbmFtZTogYWxsIGluc3RhbmNlcyBvZiB0aGUgc2FtZSBiZWhhdmlvciBleHBvc2VcbiAgICAgKiBpZGVudGljYWwgc2NoZW1hcywgc28gZWFjaCB0b29sIGlzIGxpc3RlZCBvbmx5IG9uY2UuXG4gICAgICogVGhlIHRhcmdldCBpbnN0YW5jZSBpcyBpZGVudGlmaWVkIGF0IGNhbGwgdGltZSB2aWEgdGhlIGB1cmlgIGFyZ3VtZW50LlxuICAgICAqL1xuICAgIHRvb2xzTGlzdChyZXE6IEpzb25ScGNSZXF1ZXN0KTogSnNvblJwY1Jlc3BvbnNlIHtcbiAgICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBjb25zdCB0b29sczogTWNwVG9vbFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiB0aGlzLl9pbnN0YW5jZXMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG9vbCBvZiBpbnN0YW5jZS5nZXRUb29scygpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWVuLmhhcyh0b29sLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlZW4uYWRkKHRvb2wubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRvb2xzLnB1c2godG9vbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE1jcC50b29sc0xpc3RSZXN1bHQocmVxLmlkLCB0b29scyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBgdG9vbHMvY2FsbGAuXG4gICAgICpcbiAgICAgKiBSb3V0aW5nIHN0cmF0ZWd5IChpbiBvcmRlcik6XG4gICAgICogMS4gSWYgYGFyZ3VtZW50cy51cmlgIGlzIHByZXNlbnQsIHJvdXRlIGRpcmVjdGx5IHRvIHRoYXQgaW5zdGFuY2UgKGZhc3QgcGF0aCkuXG4gICAgICogICAgQmVoYXZpb3JzIHNob3VsZCBkZWNsYXJlIGB1cmlgIGFzIGEgcmVxdWlyZWQgZmllbGQgaW4gdGhlaXIgdG9vbCBgaW5wdXRTY2hlbWFgLlxuICAgICAqIDIuIE90aGVyd2lzZSwgc2NhbiBhbGwgaW5zdGFuY2VzIGZvciB0aGUgZmlyc3Qgb25lIHRoYXQgZGVjbGFyZXMgdGhlIHRvb2wgKGZhbGxiYWNrXG4gICAgICogICAgZm9yIHNpbmdsZS1pbnN0YW5jZSBzY2VuYXJpb3Mgd2hlcmUgYSBVUkkgaXMgbm90IG5lZWRlZCkuXG4gICAgICovXG4gICAgYXN5bmMgdG9vbHNDYWxsKHJlcTogSnNvblJwY1JlcXVlc3QpOiBQcm9taXNlPEpzb25ScGNSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSByZXEucGFyYW1zIGFzIHsgbmFtZT86IHN0cmluZzsgYXJndW1lbnRzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSB8IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZTtcbiAgICAgICAgY29uc3QgYXJncyA9IHBhcmFtcz8uYXJndW1lbnRzID8/IHt9O1xuXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuIE1jcC5pbnZhbGlkUGFyYW1zKHJlcS5pZCwgXCJNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlcjogbmFtZVwiKTtcblxuICAgICAgICAvLyBGYXN0IHBhdGg6IHJvdXRlIGJ5IGluc3RhbmNlIFVSSSB3aGVuIHRoZSBjYWxsZXIgcHJvdmlkZXMgaXQuXG4gICAgICAgIGNvbnN0IHVyaSA9IGFyZ3NbXCJ1cmlcIl0gYXMgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAodXJpKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuX2luc3RhbmNlcy5nZXQodXJpKTtcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UpIHJldHVybiBNY3AuaW5zdGFuY2VOb3RGb3VuZChyZXEuaWQsIHVyaSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FsbFRvb2wocmVxLCBpbnN0YW5jZSwgbmFtZSwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWxsYmFjazogZmluZCB0aGUgZmlyc3QgaW5zdGFuY2UgdGhhdCBkZWNsYXJlcyB0aGlzIHRvb2wuXG4gICAgICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgdGhpcy5faW5zdGFuY2VzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuZ2V0VG9vbHMoKS5zb21lKCh0KSA9PiB0Lm5hbWUgPT09IG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGxUb29sKHJlcSwgaW5zdGFuY2UsIG5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE1jcC50b29sTm90Rm91bmQocmVxLmlkLCBuYW1lKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gV2ViU29ja2V0IGNvbm5lY3Rpb24gbWFuYWdlbWVudFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIGEgbmV3IFdlYlNvY2tldCBjb25uZWN0aW9uIGFuZCB3aXJlcyB1cCBhbGwgZXZlbnQgaGFuZGxlcnMuXG4gICAgICogQ2FsbGVkIGJ5IHtAbGluayBzdGFydH0gYW5kIHNjaGVkdWxlZCBhZ2FpbiBieSB7QGxpbmsgX3NjaGVkdWxlUmVjb25uZWN0fS5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9jb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHRoaXMuX3dzVXJsKTtcblxuICAgICAgICAgICAgd3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dzID0gd3M7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RBdHRlbXB0cyA9IDA7IC8vIHJlc2V0IGJhY2stb2ZmIGNvdW50ZXIgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHdzLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gT25seSByZWplY3QgdGhlIGluaXRpYWwgcHJvbWlzZTsgc3Vic2VxdWVudCBlcnJvcnMgYXJlIGhhbmRsZWQgdmlhIG9uY2xvc2UuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1J1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgTWNwU2VydmVyOiBjb3VsZCBub3QgY29ubmVjdCB0byAke3RoaXMuX3dzVXJsfWApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB3cy5vbmNsb3NlID0gKCkgPT4gdGhpcy5fb25EaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHdzLm9ubWVzc2FnZSA9IChldmVudDogTWVzc2FnZUV2ZW50PHN0cmluZz4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldElkbGVUaW1lcigpO1xuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5faGFuZGxlTWVzc2FnZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuZXZlciB0aGUgV2ViU29ja2V0IGNsb3NlcyAoY2xlYW5seSBvciBub3QpLlxuICAgICAqIFRyaWdnZXJzIHJlY29ubmVjdGlvbiB1bmxlc3Mge0BsaW5rIHN0b3B9IHdhcyBjYWxsZWQgZXhwbGljaXRseS5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9vbkRpc2Nvbm5lY3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl93cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Nlc3Npb25SZWFkeSA9IGZhbHNlOyAvLyBoYW5kc2hha2UgbXVzdCBiZSByZXBlYXRlZCBvbiByZWNvbm5lY3Rpb25cbiAgICAgICAgdGhpcy5fY2xlYXJJZGxlVGltZXIoKTtcblxuICAgICAgICBpZiAoIXRoaXMuX3N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlUmVjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY2hlZHVsZXMgYSByZWNvbm5lY3Rpb24gYXR0ZW1wdCB1c2luZyBleHBvbmVudGlhbCBiYWNrLW9mZiB3aXRoIGppdHRlci5cbiAgICAgKlxuICAgICAqIERlbGF5IGZvcm11bGE6IGBtaW4oYmFzZURlbGF5TXMgKiAyXmF0dGVtcHQsIG1heERlbGF5TXMpICogaml0dGVyYFxuICAgICAqIHdoZXJlIGBqaXR0ZXIg4oiIIFswLjUsIDEuMF1gIHRvIHNwcmVhZCByZWNvbm5lY3Rpb24gc3Rvcm1zLlxuICAgICAqXG4gICAgICogR2l2ZXMgdXAgc2lsZW50bHkgb25jZSBgbWF4QXR0ZW1wdHNgIGlzIHJlYWNoZWQgKGlmIGNvbmZpZ3VyZWQpLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3NjaGVkdWxlUmVjb25uZWN0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBwb2xpY3kgPSB0aGlzLl9vcHRpb25zLnJlY29ubmVjdDtcbiAgICAgICAgLy8gTm8gcmVjb25uZWN0IHBvbGljeSBtZWFucyBubyBhdXRvbWF0aWMgcmVjb25uZWN0aW9uLlxuICAgICAgICBpZiAoIXBvbGljeSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG1heEF0dGVtcHRzID0gcG9saWN5Lm1heEF0dGVtcHRzID8/IEluZmluaXR5O1xuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0QXR0ZW1wdHMgPj0gbWF4QXR0ZW1wdHMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBiYXNlID0gcG9saWN5LmJhc2VEZWxheU1zID8/IDFfMDAwO1xuICAgICAgICBjb25zdCBtYXggPSBwb2xpY3kubWF4RGVsYXlNcyA/PyAzMF8wMDA7XG4gICAgICAgIGNvbnN0IGppdHRlciA9IDAuNSArIE1hdGgucmFuZG9tKCkgKiAwLjU7IC8vIFswLjUsIDEuMF1cbiAgICAgICAgY29uc3QgZGVsYXkgPSBNYXRoLm1pbihiYXNlICogMiAqKiB0aGlzLl9yZWNvbm5lY3RBdHRlbXB0cywgbWF4KSAqIGppdHRlcjtcblxuICAgICAgICB0aGlzLl9yZWNvbm5lY3RBdHRlbXB0cysrO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdm9pZCB0aGlzLl9jb25uZWN0KCksIGRlbGF5KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTWVzc2FnZSBoYW5kbGluZ1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIEVudHJ5IHBvaW50IGZvciBldmVyeSByYXcgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAgICogRGlzdGluZ3Vpc2hlcyBKU09OLVJQQyBub3RpZmljYXRpb25zIChubyBgaWRgKSBmcm9tIHJlcXVlc3RzIChoYXMgYGlkYCk6XG4gICAgICogLSBOb3RpZmljYXRpb25zIGFyZSBoYW5kbGVkIGJ1dCBuZXZlciBhbnN3ZXJlZC5cbiAgICAgKiAtIFJlcXVlc3RzIGFyZSBkaXNwYXRjaGVkIGFuZCBwcm9kdWNlIGEgcmVzcG9uc2Ugc2VudCBiYWNrIG92ZXIgdGhlIHNvY2tldC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVNZXNzYWdlKGRhdGE6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsZXQgbXNnOiBKc29uUnBjUmVxdWVzdCB8IEpzb25ScGNOb3RpZmljYXRpb247XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtc2cgPSBKU09OLnBhcnNlKGRhdGEpIGFzIEpzb25ScGNSZXF1ZXN0IHwgSnNvblJwY05vdGlmaWNhdGlvbjtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAvLyBQZXIgSlNPTi1SUEMgMi4wIHNwZWMsIGlkIGlzIG51bGwgd2hlbiB0aGUgcmVxdWVzdCBjYW5ub3QgYmUgcGFyc2VkLlxuICAgICAgICAgICAgdGhpcy5fc2VuZChNY3AucGFyc2VFcnJvcigpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGlmaWNhdGlvbnMgY2Fycnkgbm8gYGlkYCDigJQgaGFuZGxlIHNpbGVudGx5LCBuZXZlciByZXNwb25kLlxuICAgICAgICBpZiAoIShcImlkXCIgaW4gbXNnKSB8fCBtc2cuaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU5vdGlmaWNhdGlvbihtc2cgYXMgSnNvblJwY05vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZW5kKGF3YWl0IHRoaXMuX2Rpc3BhdGNoKG1zZyBhcyBKc29uUnBjUmVxdWVzdCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgSlNPTi1SUEMgbm90aWZpY2F0aW9ucyBzZW50IGJ5IHRoZSBjbGllbnQuXG4gICAgICogUGVyIHRoZSBNQ1Agc3BlYywgbm8gcmVzcG9uc2UgaXMgZXZlciBzZW50IGZvciBub3RpZmljYXRpb25zLlxuICAgICAqIFVua25vd24gbm90aWZpY2F0aW9uIG1ldGhvZHMgYXJlIHNpbGVudGx5IGlnbm9yZWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFuZGxlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogSnNvblJwY05vdGlmaWNhdGlvbik6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5tZXRob2QpIHtcbiAgICAgICAgICAgIGNhc2UgXCJub3RpZmljYXRpb25zL2luaXRpYWxpemVkXCI6XG4gICAgICAgICAgICAgICAgLy8gQ2xpZW50IGhhcyBmaW5pc2hlZCBpdHMgb3duIGluaXRpYWxpc2F0aW9uIGFuZCBpcyByZWFkeSB0byBzZW5kIHJlcXVlc3RzLlxuICAgICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb25SZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBBbGwgb3RoZXIgbm90aWZpY2F0aW9ucyBhcmUgaW50ZW50aW9uYWxseSBpZ25vcmVkLlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm91dGVzIGEgcGFyc2VkIEpTT04tUlBDIHJlcXVlc3QgdG8gdGhlIGNvcnJlY3QgaGFuZGxlciBtZXRob2QuXG4gICAgICogVW5rbm93biBtZXRob2RzIHJlY2VpdmUgYSBgLTMyNjAxIE1ldGhvZCBub3QgZm91bmRgIGVycm9yLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2Rpc3BhdGNoKHJlcTogSnNvblJwY1JlcXVlc3QpOiBQcm9taXNlPEpzb25ScGNSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHJlcS5tZXRob2QpIHtcbiAgICAgICAgICAgIGNhc2UgXCJpbml0aWFsaXplXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZXJzLmluaXRpYWxpemUocmVxKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZXNvdXJjZXMvbGlzdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVycy5yZXNvdXJjZXNMaXN0KHJlcSk7XG4gICAgICAgICAgICBjYXNlIFwicmVzb3VyY2VzL3RlbXBsYXRlcy9saXN0XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZXJzLnJlc291cmNlc1RlbXBsYXRlc0xpc3QocmVxKTtcbiAgICAgICAgICAgIGNhc2UgXCJyZXNvdXJjZXMvcmVhZFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVycy5yZXNvdXJjZXNSZWFkKHJlcSk7XG4gICAgICAgICAgICBjYXNlIFwidG9vbHMvbGlzdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVycy50b29sc0xpc3QocmVxKTtcbiAgICAgICAgICAgIGNhc2UgXCJ0b29scy9jYWxsXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZXJzLnRvb2xzQ2FsbChyZXEpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gTWNwLm1ldGhvZE5vdEZvdW5kKHJlcS5pZCwgcmVxLm1ldGhvZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSWRsZSB0aW1lb3V0XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBpZGxlLXRpbWVvdXQgdGltZXIgb24gZWFjaCBpbmNvbWluZyBtZXNzYWdlLlxuICAgICAqIFdoZW4gdGhlIHRpbWVyIGV4cGlyZXMgdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2VkLCB3aGljaCBtYXkgdHJpZ2dlciByZWNvbm5lY3Rpb24uXG4gICAgICovXG4gICAgcHJpdmF0ZSBfcmVzZXRJZGxlVGltZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy5pZGxlVGltZW91dE1zKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2NsZWFySWRsZVRpbWVyKCk7XG4gICAgICAgIHRoaXMuX2lkbGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fd3M/LmNsb3NlKCk7XG4gICAgICAgIH0sIHRoaXMuX29wdGlvbnMuaWRsZVRpbWVvdXRNcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2xlYXJJZGxlVGltZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9pZGxlVGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pZGxlVGltZXIpO1xuICAgICAgICAgICAgdGhpcy5faWRsZVRpbWVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTaGFyZWQgaGVscGVyc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIERlcml2ZXMgc2VydmVyIGNhcGFiaWxpdGllcyBmcm9tIHJlZ2lzdGVyZWQgYmVoYXZpb3IgdHlwZXMuXG4gICAgICogQW55IHJlZ2lzdGVyZWQgYmVoYXZpb3IgaW1wbGllcyBib3RoIGByZXNvdXJjZXNgIGFuZCBgdG9vbHNgIHN1cHBvcnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZGVyaXZlQ2FwYWJpbGl0aWVzKCk6IE1jcFNlcnZlckNhcGFiaWxpdGllcyB7XG4gICAgICAgIGlmICh0aGlzLl9iZWhhdmlvcnMuc2l6ZSA9PT0gMCAmJiB0aGlzLl9pbnN0YW5jZXMuc2l6ZSA9PT0gMCkgcmV0dXJuIHt9O1xuICAgICAgICByZXR1cm4geyByZXNvdXJjZXM6IHt9LCB0b29sczoge30gfTtcbiAgICB9XG5cbiAgICAvKiogSW52b2tlcyBhIHRvb2wgb24gYSBzcGVjaWZpYyBpbnN0YW5jZSBhbmQgd3JhcHMgdGhlIHJlc3VsdCBhcyBhIEpTT04tUlBDIHJlc3BvbnNlLiAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2NhbGxUb29sKHJlcTogSnNvblJwY1JlcXVlc3QsIGluc3RhbmNlOiBJTWNwQmVoYXZpb3JJbnN0YW5jZSwgbmFtZTogc3RyaW5nLCBhcmdzOiB1bmtub3duKTogUHJvbWlzZTxKc29uUnBjUmVzcG9uc2U+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGluc3RhbmNlLmNhbGxUb29sKG5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIE1jcC50b29sQ2FsbFJlc3VsdChyZXEuaWQsIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBNY3AuaW50ZXJuYWxFcnJvcihyZXEuaWQsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIkludGVybmFsIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFNlbmRzIGEgc2VyaWFsaXplZCBKU09OLVJQQyByZXNwb25zZSBvdmVyIHRoZSBXZWJTb2NrZXQsIGlmIG9wZW4uICovXG4gICAgcHJpdmF0ZSBfc2VuZChyZXNwb25zZTogSnNvblJwY1Jlc3BvbnNlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl93cz8ucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICAgIHRoaXMuX3dzLnNlbmQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgKiBmcm9tIFwiLi9pbnRlcmZhY2VzL2luZGV4XCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NlcnZlci9pbmRleFwiO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=