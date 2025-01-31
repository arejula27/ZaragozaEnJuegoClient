import { FC, useEffect, useState } from 'react';
import { Offer } from '../../../../core/negotiations/domain';
import { chooseColor } from '../../../../utils/kindsSelector';
import { DefaultPropertie, IPropertieRepo, Kind, Propertie } from '../../../../core/properties/domain';
import { ReactComponent as SchoolIcon } from '/src/assets/graduation-cap-solid.svg';
import { ReactComponent as MedicalIcon } from '/src/assets/suitcase-medical-solid.svg';
import { ReactComponent as GrocerieIcon } from '/src/assets/utensils-solid.svg';
import { ReactComponent as TrainIcon } from '/src/assets/train-solid.svg';
import { ReactComponent as UndefinedIcon } from '/src/assets/undefined-icon.svg';
import { HTTPOfferRepo } from '../../../../infraestructure/http/OfferRepo';
import { toast } from 'react-toastify';
import { HttpPropertieRepo } from '../../../../infraestructure/http/PropertieRepo';

interface Offers {
  offer: Offer,
}

const PropertyIcon = (kind: Kind) => {
  switch (kind) {
    case 'health':
      return <MedicalIcon style={{ fill: chooseColor(kind) }} className={'h-full lg:w-16 w-10 px-1 sm:px-2'} />;

    case 'groceries':
      return <GrocerieIcon style={{ fill: chooseColor(kind) }} className={'h-full lg:w-16 w-10 px-1 sm:px-2'} />;

    case 'education':
      return <SchoolIcon style={{ fill: chooseColor(kind) }} className={'h-full lg:w-16 w-10 px-1 sm:px-2'} />;

    case 'transport':
      return <TrainIcon style={{ fill: chooseColor(kind) }} className={'h-full lg:w-16 w-10 px-1 sm:px-2'} />;
    default:
      return <></>;
  }
};

const OfferCard: FC<Offers> = ({ offer }) => {
  const offerRepo: HTTPOfferRepo = new HTTPOfferRepo()
  const propertyRepo: IPropertieRepo = new HttpPropertieRepo()
  const [property, setProperty] = useState<Propertie>(DefaultPropertie())
  const [visible, setVisible] = useState<Boolean>(true)
  useEffect(() => {
    if (offer.property !== undefined) {
        try {
            propertyRepo.getPropertieById(offer.property).then((property: Propertie) => {
                setProperty(property)
            })
        } catch (error) {
            toast.error('Error al obtener datos de la propiedad', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
        }
    }
}, [])

function acceptSelectedOffer() {
  offerRepo.execOffer(offer.id).then(() => {
    offerRepo.deleteOffer(offer.id).then(() => {
      setVisible(false)
    }).catch((error) => {
      console.log(error)
    })
  }).catch((error) => {
    console.log(error)
  })
}

function declineSelectedOffer() {
  offerRepo.deleteOffer(offer.id).then(() => {
    setVisible(false)
  }).catch((error) => {
    console.log(error)
  })
}

    return (
      <div>
        { visible && (
          <div style={{ color: chooseColor(property.kind) }} className='flex flex-col-3 justify-center align-middle overflow-x-clip items-top border w-auto rounded-3xl py-2 px-1 sm:px-4 my-4 h-100'>
            <div className='flex flex-col justify-center items-center'>
              <UndefinedIcon style={{ fill: '#D8DEE9' }} className='w-10 h-10 object-cover rounded-full'/>
              <h1 className='text-xs text-nord1' >{offer.offerer}</h1>
              <h1 style={{ color: chooseColor(property.kind) }} className={'w-50 font-bold text-xs lg:text-lg md:text-base sm:text-sm xl:text-xl text-center'}>{offer.amount}€</h1>
            </div>
            <div className='flex items-center justify-top mt-4 mx-1 sm:mx-2 md:mx-4 flex-col'>
              {PropertyIcon(property.kind)}
              <div className='flex flex-col items-center px-5 py-1 w-full'>
                <button className='items-center text-xs text-primary py-1 my-1 w-20 rounded-lg sm:mx-2 mx-1 bg-green-nord'
                  onClick={acceptSelectedOffer}>Aceptar</button>
                <button className='items-center text-xs text-hover py-1 my-1 w-20 rounded-lg bg-red-nord'
                  onClick={declineSelectedOffer}>Rechazar</button>
              </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <UndefinedIcon style={{ fill: '#D8DEE9' }} className='w-10 h-10 object-cover rounded-full'/>
              <h1 className='text-xs text-nord1' >Tú</h1>
              <h1 style={{ color: chooseColor(property.kind) }} className='w-50 text-center text-sm lg:text-base md:text-sm xl:text-lg font-bold text-primary'>{property.name}</h1>
            </div>
          </div>
        )}
      </div>
  );
};

export { OfferCard };
