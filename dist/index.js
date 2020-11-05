"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instagram_1 = __importDefault(require("./core/instagram"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const instagram = new instagram_1.default();
    //await instagram.login('juliana_dardinha', 'esqueceucontato', true).catch(e => console.error(e))
    yield instagram.followByUsername('bestall.carlos');
    //console.log(await instagram.getIdByUsername('rafael_rigoz'))
}))();
