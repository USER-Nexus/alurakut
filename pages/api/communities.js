import { SiteClient } from 'datocms-client';

export default async function getRequest(request, response) {

    if(request.method === 'POST') {
        const TOKEN = '2e87c96638c3bfe8bbb0938ad16ade'
        const client = new SiteClient(TOKEN);
        const createdRecord = await client.item.create({
            itemType: "966548",
            ...request.body,
        })
    
        console.log(createdRecord);
    
        response.json({
            createdRecord: createdRecord,
        })
        return;
    }

    response.status(404).json({
        message: 'Nothing on GET, just on POST'
    })
}