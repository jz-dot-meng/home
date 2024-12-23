import { Keypair } from "@solana/web3.js";
import { encodeBase58, Wallet } from "ethers";
import { describe, expect, test } from "vitest";
import { LocalUserManagement, UserValidator } from "./user";

describe("decrypt", () => {
    test("encodes and decrypts a evm signed message correctly", () => {
        const wallet = new Wallet(Wallet.createRandom().privateKey);
        const signedMessage = LocalUserManagement.signMessage(
            { privateKeyType: "evm", privateKey: wallet.privateKey },
            { statement: "test", expiresInDays: 1 }
        );

        const decrypted = UserValidator.validateToken("evm", wallet.address, signedMessage);
        expect(decrypted.address).toBe(wallet.address);
        expect(decrypted.statement).toBe("test");
    });

    test("encodes and decrypts a svm signed message correctly", () => {
        const wallet = Keypair.generate();
        const signedMessage = LocalUserManagement.signMessage(
            { privateKeyType: "svm", privateKey: encodeBase58(wallet.secretKey) },
            { statement: "test", expiresInDays: 1 }
        );

        const decrypted = UserValidator.validateToken(
            "svm",
            wallet.publicKey.toBase58(),
            signedMessage
        );
        expect(decrypted.address).toBe(wallet.publicKey.toBase58());
        expect(decrypted.statement).toBe("test");
    });
});