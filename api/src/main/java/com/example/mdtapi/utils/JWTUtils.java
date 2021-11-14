package com.example.mdtapi.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.mdtapi.models.Person;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtils {

    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(Person person) {
        Algorithm alg = Algorithm.HMAC256(secretKey);
        Date exp = new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000);
        return JWT.create()
                .withClaim("regNum", person.getRegNum())
                .withExpiresAt(exp)
                .sign(alg);
    }

    public String validateToken(String token) {
        Algorithm alg = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(alg).build();

        try {
            DecodedJWT jwt = verifier.verify(token);
            return jwt.getClaim("regNum").asString();
        } catch (JWTDecodeException exception) {
            return null;
        } catch (JWTVerificationException exception) {
            return "";
        }
    }
}
