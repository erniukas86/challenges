const athleteMap = {
    'dariuso.': {
        name: 'Darius Orvidas',
        avatar: '4ce9e897-9d5a-4e33-b0f3-832143552b02.jpg'
    },
    'simasb.': {
        name: 'Simas Bakus',
        avatar: 'f80137ee-79f1-4f30-a797-870386de90e3.jpg'
    },
    'henrikasm.': {
        name: 'Henrikas Miliūnas',
        avatar: '42404403-845d-4435-97c9-3e0b954591d9.jpg'
    },
    'simasv.': {
        name: 'Simas Veleckas',
        avatar: 'd82c14c1-c1b0-4c13-b92d-e4028fac2d0c.jpg'
    },
    'petern.': {
        name: 'Peter Nijsen',
        avatar: 'daa8311d-36fe-45ad-8682-16ac0137bf62.jpg'
    },
    'erniukasb.': {
        name: 'Ernestas Burokas',
        avatar: '16e172c8-9b6f-4c90-b94d-9eadc4762d31.jpg'
    },
    'edgarasa.': {
        name: 'Edgaras Abromaitis',
        avatar: 'a194a2ea-bb64-4903-8eea-c32f69190703.jpg'
    },
    'edvinasv.': {
        name: 'Edvinas Velička',
        avatar: 'f54486c2-7c17-4fd1-8de3-2cd80569b3d6.jpg'
    },
    'rokass.': {
        name: 'Rokas Sidaravičius',
        avatar: '2360c973-7a42-490e-a014-cc17645efb8a.jpg'
    },
    'pauliusv.': {
        name: 'Paulius Vaitkevičius',
        avatar: 'ee2aaccb-ea6c-4e4a-969a-3e308cbf6dc3.jpg'
    },
    'martynasj.': {
        name: 'Martynas Juzaitis',
        avatar: '8bc01fc1-5fe4-4741-b8c5-b0545593e052.jpg'
    },
    'mindaugass.': {
        name: 'Mindaugas Stanionis',
        avatar: '90ef9116-0eb6-4e12-ba43-b06a55becd41.jpg'
    },
    'audriusl.': {
        name: 'Audrius Lukoševičius',
        avatar: '882a5bc3-3990-451a-ad5d-f0354da953fc.jpg'
    },
    'andrejusi.': {
        name: 'Andrejus Ivaščenko',
        avatar: '94e4a794-6a5d-4722-8992-750256945b6a.png'
    }
};

export function getAthleteName (name) {
    if(athleteMap[name.toLowerCase()]){
        return athleteMap[name.toLowerCase()].name;
    }

    return name;
}

const baseAvatarUrl = 'https://cm-b09eaa56-75eb-42f6-9d77-145ac6f6dedb.s3.eu-central-1.amazonaws.com/system/db/images/employees_photos/';

export function getAthleteAvatar (name) {
    if(athleteMap[name.toLowerCase()] && athleteMap[name.toLowerCase()].avatar){
        return `${baseAvatarUrl}${athleteMap[name.toLowerCase()].avatar}`;
    }

    return `https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d4/b2/cd/d4b2cd6b-3281-afaa-75bd-f999d234b879/source/512x512bb.jpg`;
}