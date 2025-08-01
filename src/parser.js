import _ from 'lodash';

const parseRss = (xmlString) => {
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parserError = doc.querySelector('parsererror');

    if (parserError) {
        throw new Error('invalidXml');
    }

    const title = doc.querySelector('channel >  title')?.textContent;
    const description = doc.querySelector('channel > description')?.textContent;
    
    const feed = { 
        id: _.uniqueId('feed_'),
        title,
        description,
    };

    const items = doc.querySelectorAll('channel > item');

    const posts = Array.from(items).map((item) => {
        const postTitle = item.querySelector('title')?.textContent;
        const postLink = item.querySelector('link')?.textContent;
        const postDescription = item.querySelector('description')?.textContent;

        if (!postTitle || !postLink) return null;

        return {
            id: _.uniqueId('post_'),
            feedId: feed.id,
            title: postTitle,
            link: postLink,
            description: postDescription,
        };
    }).filter(Boolean);

    return { feed, posts };
};

export default parseRss;
