export default {
    name: 'pin',
    type: 'document',
    title: 'Pin',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title'
        },
        {
            name: 'about',
            type: 'string',
            title: 'About'
        },
        {
            name: 'destination',
            type: 'url',
            title: 'Destination'
        },
        {
            name: 'category',
            type: 'string',
            title: 'Category'
        },
        {
            name: 'image',
            type: 'image',
            title: 'Image',
            option: {
                hotspot: true
            }
        },
        {
            name: 'userID',
            title: 'UserID',
            type: 'string',
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy',
        },
        {
            name: 'save',
            title: 'Save',
            type: 'array',
            of: [{ type: 'save' }]
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{ type: 'comments' }]
        },
    ]
}