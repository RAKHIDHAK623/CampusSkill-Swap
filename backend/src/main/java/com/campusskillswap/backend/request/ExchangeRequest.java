package com.campusskillswap.backend.request;

import lombok.Data;

@Data
public class ExchangeRequest {

    private Long receiverId;
    private Long skillId;
}
