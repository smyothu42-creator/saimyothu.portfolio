// Fake pickup order for recording the guest app's Online Order flow: nothing is sent to the backend.
const at = (m) => new Date(Date.now() + m * 60000).toISOString()
export default [
  { method: 'POST', re: /\/pickup\/orders(\?|$)/, body: () => ({ success: true, data: { order: { id: 'demo-pickup-1', orderNumber: 'ORD-2418', itemCount: 2, totalAmount: '19000', customerNote: null, items: [{ id: 'pi1' }, { id: 'pi2' }], pickup: { code: '418', name: 'Aye Chan', phone: '09 777 123 456', estimatedReadyAt: at(30) } } } }) },
  { method: 'GET', re: /\/pickup\/orders\/demo-pickup-1/, body: () => ({ success: true, data: { id: 'demo-pickup-1', orderNumber: 'ORD-2418', status: 'preparing', paymentStatus: 'unpaid', pickupCode: '418', estimatedReadyAt: at(30), items: [{ id: 'pi1', quantity: 1, cancelledQuantity: 0, activeQuantity: 1 }, { id: 'pi2', quantity: 1, cancelledQuantity: 0, activeQuantity: 1 }] } }) },
]
