
### **PARKED NOTE:**

1. Need to refactor the folder structure and create sub-folder inside business/ and organise all the components file if its easy - Will not do as its not value for time.
2. We should have proper clean data with appropriate mapping for all in mock if possible.


### **ROUGH NOTE:**

1. We need to check the content relevant in each expanded view across all modules cards e.g. Lead shows too mcuh information
2. Is this modal portal width constraint applicable to mobile or desktop both ?
3. Shall we get another expanded / close icon +- up arrow / down etc. insteda of More / Less just to keep card compact
4. Need to delete CustomerPaymentTab as its replaced by account statement tab
5. Need to change Final Invoice name to Sales Invoice
6. we have done hard coding or !important in index.css file
7. when we go to any new tab, it should start from top and not in between
8. We need to delete not active business profile from the mock data


### **UI Issues:**

Important 

1. CTA not visible and if you scroll down then it becomes visible but product header goes missing
2. Alerts needs to be there in each tab which talks about key issues
4. Search should show result in the corresponding tab 
5. we should have some option to filter content in each tab by keyword
11. Update stock function not working in stock
15. Update stck not working in Inward
16. Approve quality / reject material not wortking in inward
17. Record Inward not implemented as CTA
18. Update Stock not implemented as CTA
19. All CTA needs to be implemenetd e.g. New Job Order, New Job Bill, New PO
21. Check do we need proper action button in Job Cards except create Lots
22. Start Work not working in Lot
23. On hold lot can't be resumed as there is no action button
24. Start QC model not scrolling down and cancel is not visible 

Parked - 

3. Call / WhatsApp not implemented action
6. View PDF not implemented in Job Order
7. Full paid bills shows due date
8. Follow up action not implemented in Job Bills
9. Filter not working across all tabs e.g. Job Orders 
10. Stock expanded view doesn't have proper style - it uses paragraph basic font
12. view history not working in stock
13. Create purchase request should be called as purchase order for critical low stock
14. View PO not applicable for Inward custoemr stock and instead it shopuld view Job Order
20. Create GRN not implemented in PO when material arrive (its shown as action in PO screen)
25. Statement should be shown as transaction in Parties 360 degree view






### **DONE:**

4. Only active quote should be shown w.r.t active lead (i.e. show quotes for only active leads and not converted to order)
6. We should have some lead associated with existing customer
5. Desktop view of Customer should show only one card per row instead of 2. this would help to stay focus on one company at a time and will follow the same pattern as pther component
4. we should remove CTA from Customer as we can't create customer on our own




