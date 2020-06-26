

// Descripción de campos del request: https://www.mercadopago.com.ar/developers/es/reference/payments/_payments/post/
export interface PaymentMercadoPago {
    transaction_amount: number; // requerido
    payment_method_id: string; // requerido
    token: string; // requerido
    installments: number; // requerido
    capture?: boolean;
    payer: Payer;
    binary_mode?: boolean;
    order?: Order;
    external_reference?: string;
    description?: string;
    metadata?: {};
    coupon_amount?: number;
    campaign_id?: number;
    coupon_code?: string;
    differential_pricing_id?: number;
    application_fee?: number;
    issuer_id?: string;
    statement_descriptor?: string; // Cómo aparecerá el pago en el resumen de tarjeta (ej.?: MERCADOPAGO).
    notification_url?: string;
    callback_url?: string;
    additional_info?: AdditionalInfo;
}


export interface Barcode {
    type?: string;
    content?: string;
    width?: number;
    height?: number;
}

export interface Shipments {
    reciver_address?: ReciverAddress;
}

export interface ReciverAddress {
    zip_code?: string;
    state_name?: string;
    city_name?: string;
    street_number?: number;
    floor?: string;
    apartament?: string;
}


export interface Address {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
}



export interface Item {
    id?: string;
    title?: string;
    description?: string;
    picture_url?: string;
    category_id?: string;
    quantity?: number;
    unit_price?: number;
}

export interface AdditionalInfo {
    ip_addres?: string;
    items?: Item[];
    payer?: AdditionalInfoPayer;
    shipments?: Shipments;
    barcode?: Barcode;
}

export interface Order {
    type?: string;
    id?: number;
}

export interface Payer {
    entity_type?: string;
    type?: string;
    id?: string;
    email: string; // requerido
    identification?: PayerIdentification;
    phone?: Phone;
    first_name?: string;
    last_name?: string;
}

export interface AdditionalInfoPayer {
    first_name?: string;
    last_name?: string;
    phone?: Phone;
    address?: Address;
    registration_date?: string;
}

export interface PayerIdentification {
    type?: string;
    number?: string;
}

export interface Phone {
    area_code?: string;
    number?: string;
    extension?: string;
}

