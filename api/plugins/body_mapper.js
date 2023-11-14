const { text } = require("express");
const body = require("../body.js");

const ticket_map = {
    early: process.env.EARLY_ID,
    regular: process.env.REGULAR_ID,
    late: process.env.LATE_ID,
    stand: process.env.STAND_ID,
};

const get_ticket_id = (name) => {
    for (item in ticket_map) {
        if (name.toLowerCase().includes(item)) {
            return ticket_map[item];
        }
    }
}

const body_mapper = (request) => {
    const now = new Date();
    const nowIso = now.toISOString();

    body.Email = request.contact_email ?? '';
    body.PaidDate = nowIso;

    request.line_items.forEach(line_item => {
        for (i=0; i < line_item.quantity; i++) {
            body.PurchaseItems.push(
                {
                    PurchaseId: 0,
                    TicketId: get_ticket_id(line_item.name),
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