export enum StatusOrder {
    SYNCH = 'SYNCH',
}

export enum StatusOrderSalesForce {
 DRAFT = 'Draft', //El pedido se ha guardado pero no se ha completado ni enviado.
 ACTIVATED = 'Activated', //El pedido se ha activado y está en proceso.
 SHIPPED = 'Shipped', //El pedido ha sido enviado al cliente
 COMPLETE = 'Complete', //El pedido se ha completado y se ha cumplido.
 CANCELLED = 'Cancelled', // El pedido se ha cancelado antes de su cumplimiento.
 CLOSED = 'Closed', // El pedido se ha cerrado después de su cumplimiento.
 PENDING_APPROVAL = 'Pending Approval', // Approval: El pedido está pendiente de aprobación antes de su procesamiento.
 PENDING_PAYMENT = 'Pending Payment', // Payment: El pedido está pendiente de pago por parte del cliente.
 PENDING_FULFILLMENT = 'Pending Fulfillment', // Fulfillment: El pedido está pendiente de cumplimiento y envío.
 INVOICED = 'Invoiced', // Se ha generado una factura para el pedido.
}

export const StatusHomologate: Record<string, string> = {
    'payment-approved': StatusOrderSalesForce.DRAFT,
    'canceled': StatusOrderSalesForce.CANCELLED,
    'ready-for-handling': StatusOrderSalesForce.COMPLETE,
    'handling': StatusOrderSalesForce.SHIPPED,
    'invoiced': StatusOrderSalesForce.INVOICED
  } as const;

export function ordinalOrderStatus( status: string): number{
    return Object.keys(StatusOrder).indexOf(status);
}