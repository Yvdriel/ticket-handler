const { text } = require("express");
const body = require("../body.js");

const ticket_map = {
    // 9195313365339: process.env.EARLY_ID,
    9792969212251: process.env.REGULAR_ID,
    // 9197725843803: process.env.LATE_ID,
    // 9197736788315: process.env.STAND_ID,
    9793007681883: process.env.LUBING_ID,
};

const get_ticket_id = (product_id) => {
    for (item in ticket_map) {
        if (ticket_map[product_id]) {
            return ticket_map[product_id];
        }
    }
}

const body_mapper = (request) => {
    const now = new Date();
    const nowIso = now.toISOString();

    body.Email = request.contact_email ?? '';
    body.PaidDate = nowIso;

    delete body.PurchaseItems;
    body.PurchaseItems = [];

    request.line_items.forEach(line_item => {
        if (!get_ticket_id(line_item.product_id)) return;

        for (i=0; i < line_item.quantity; i++) {
            body.PurchaseItems.push(
                {
                    TicketId: get_ticket_id(line_item.product_id),
                    TicketHolderEmail: request.contact_email,
                    TicketHolderFirstname: request.billing_address.first_name,
                    TicketHolderLastname: request.billing_address.last_name,
                    TicketHolderAddress: request.billing_address.address1,
                    TicketHolderCity: request.billing_address.city,
                    TicketHolderPostalCode: request.billing_address.zip,
                    TicketHolderCountry: request.billing_address.country,
                  }
            );
        }
    });
    
    return body
}

module.exports = body_mapper;