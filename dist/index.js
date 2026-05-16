"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInfiniteScroll = void 0;
var react_1 = require("react");
var axios_1 = require("axios");
var lodash_1 = require("lodash");
function useInfiniteScroll(_a) {
    var _this = this;
    var url = _a.url, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.initialData, initialData = _c === void 0 ? [] : _c, dependency = _a.dependency, _d = _a.searchQuery, searchQuery = _d === void 0 ? "" : _d, _e = _a.debounceDelay, debounceDelay = _e === void 0 ? 500 : _e, authToken = _a.authToken, _f = _a.headers, headers = _f === void 0 ? {} : _f;
    var _g = (0, react_1.useState)(false), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(1), page = _h[0], setPage = _h[1];
    var _j = (0, react_1.useState)(1), totalPages = _j[0], setTotalPages = _j[1];
    var _k = (0, react_1.useState)(initialData), data = _k[0], setData = _k[1];
    var _l = (0, react_1.useState)(null), error = _l[0], setError = _l[1];
    var listRef = (0, react_1.useRef)(null);
    // Refs so the stable debounced closure always reads current values
    var loadingRef = (0, react_1.useRef)(false);
    var pageRef = (0, react_1.useRef)(1);
    // Always-fresh fetch implementation; called through the stable debounced wrapper
    var fetchImplRef = (0, react_1.useRef)();
    fetchImplRef.current = function (query, fetchUrl, currentPage) { return __awaiter(_this, void 0, void 0, function () {
        var requestHeaders, response_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loadingRef.current)
                        return [2 /*return*/];
                    requestHeaders = __assign(__assign({}, headers), (authToken ? { Authorization: "Bearer ".concat(authToken) } : {}));
                    loadingRef.current = true;
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(fetchUrl, "?page=").concat(currentPage, "&limit=").concat(limit, "&search=").concat(query), { headers: requestHeaders })];
                case 2:
                    response_1 = _a.sent();
                    setData(function (prev) {
                        return currentPage === 1
                            ? response_1.data.results
                            : __spreadArray(__spreadArray([], prev, true), response_1.data.results, true);
                    });
                    setTotalPages(response_1.data.pagination.totalPages);
                    setError(null);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Fetch error:", err_1);
                    setError("Failed to fetch data.");
                    return [3 /*break*/, 5];
                case 4:
                    loadingRef.current = false;
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Stable debounced trigger — never recreated so debounce state is preserved across renders
    var debouncedFetch = (0, react_1.useRef)((0, lodash_1.debounce)(function (query, fetchUrl, currentPage) {
        var _a;
        (_a = fetchImplRef.current) === null || _a === void 0 ? void 0 : _a.call(fetchImplRef, query, fetchUrl, currentPage);
    }, debounceDelay));
    // Cancel any pending debounced call on unmount
    (0, react_1.useEffect)(function () {
        var d = debouncedFetch.current;
        return function () { return d.cancel(); };
    }, []);
    var fetchData = (0, react_1.useCallback)(function (query, fetchUrl) {
        debouncedFetch.current(query !== null && query !== void 0 ? query : searchQuery, fetchUrl !== null && fetchUrl !== void 0 ? fetchUrl : url, pageRef.current);
    }, [searchQuery, url]);
    // Reset and re-fetch from page 1 when the data source changes
    (0, react_1.useEffect)(function () {
        pageRef.current = 1;
        setPage(1);
        setData([]);
        setError(null);
        debouncedFetch.current(searchQuery, url, 1);
    }, [dependency, searchQuery, url]);
    // Fetch subsequent pages as the user scrolls (page > 1 only; page 1 handled above)
    (0, react_1.useEffect)(function () {
        if (page <= 1)
            return;
        pageRef.current = page;
        debouncedFetch.current(searchQuery, url, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    var handleScroll = (0, react_1.useCallback)(function () {
        if (loadingRef.current || page >= totalPages)
            return;
        if (listRef.current) {
            var _a = listRef.current, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            if (scrollHeight - scrollTop <= clientHeight * 1.1) {
                setPage(function (prev) { return prev + 1; });
            }
        }
    }, [page, totalPages]);
    return { listRef: listRef, data: data, loading: loading, error: error, handleScroll: handleScroll, fetchData: fetchData };
}
exports.useInfiniteScroll = useInfiniteScroll;
